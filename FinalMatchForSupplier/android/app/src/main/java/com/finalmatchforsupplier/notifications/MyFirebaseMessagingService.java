package com.finalmatchforsupplier.notifications;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.finalmatchforsupplier.MainActivity;
import com.finalmatchforsupplier.MainApplication;
import com.finalmatchforsupplier.MyBroadcastReceiver;
import com.finalmatchforsupplier.R;
import com.finalmatchforsupplier.models.*;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import androidx.core.app.NotificationManagerCompat;

import java.util.HashMap;
import java.util.Map;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "MessageService";
    private NotificationObject notificationObject = new NotificationObject();
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.getFrom());
        if (remoteMessage.getData().size() > 0) {
            Map<String, String> data = remoteMessage.getData();
            notificationObject = new NotificationObject(
                    data.get("title") == null ? "" : data.get("title"),
                    data.get("body") == null ? "" : data.get("body"),
                    new HashMap<>()
            );
            this.pushRemoteNotification(notificationObject);
        }

    }
    @Override
    public void onNewToken(String token) {
        //Not called
        Log.d(TAG, "Refreshed token: " + token);
    }
    public void pushRemoteNotification(NotificationObject notificationObject) {
        Context context = this;
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction("OK");
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, intent, 0);
        Intent broadcastIntent = new Intent(context, MyBroadcastReceiver.class);
        broadcastIntent.putExtra("data", "haha");

        PendingIntent actionIntent = PendingIntent.getBroadcast(context, 0, broadcastIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification = new NotificationCompat.Builder(context, MainApplication.CHANNEL_1_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(notificationObject.getTitle())
                .setContentText(notificationObject.getBody())
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setContentIntent(contentIntent)
                .setColor(Color.BLUE)
                .addAction(R.drawable.ic_notification,"OK",
                        actionIntent)
                .build();
        NotificationManagerCompat notificationManager =  NotificationManagerCompat.from(context);
        notificationManager.notify(2, notification);
    }
}