package com.finalmatchclient.notifications;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;

import androidx.core.app.NotificationCompat;
import android.util.Log;

import com.finalmatchclient.*;
import com.finalmatchclient.MainApplication;
import com.finalmatchforsupplier.MyBroadcastReceiver;
import com.finalmatchclient.R;
import com.finalmatchclient.models.*;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import androidx.core.app.NotificationManagerCompat;

import java.util.HashMap;
import java.util.Map;

import java.io.IOException;
import java.net.URL;
import java.util.Map;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.NotificationCompat;
import android.util.Log;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "MessageService";
    private NotificationObject notificationObject = new NotificationObject();
    public static final String FCM_PARAM = "picture";
    private static final String CHANNEL_NAME = "FCM";
    private static final String CHANNEL_DESC = "Firebase Cloud Messaging";
    private int numMessages = 0;
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
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
        Context context = getApplicationContext();
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction("OK");
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, intent, 0);
        Intent broadcastIntent = new Intent(context, MyBroadcastReceiver.class);
//        broadcastIntent.putExtra("data", "haha");

        PendingIntent actionIntent = PendingIntent.getBroadcast(context, 0, broadcastIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification = new NotificationCompat.Builder(context, MainApplication.CHANNEL_1_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(notificationObject.getTitle())
                .setContentText(notificationObject.getBody())
                .setDefaults(Notification.DEFAULT_SOUND)
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(notificationObject.getBody()))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT).build();
        NotificationManagerCompat notificationManager =  NotificationManagerCompat.from(context);
        notificationManager.notify(2, notification);
    }
}