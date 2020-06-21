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
            RemoteMessage.Notification notification = remoteMessage.getNotification();
            Log.d("FROM", remoteMessage.getFrom());
            sendNotification(notification, data);
            //this.pushRemoteNotification(notificationObject);
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

//        Notification notification = new NotificationCompat.Builder(context, MainApplication.CHANNEL_1_ID)
//                .setSmallIcon(R.drawable.ic_notification)
//                .setContentTitle(notificationObject.getTitle())
//                .setContentText(notificationObject.getBody())
//                .setPriority(NotificationCompat.PRIORITY_HIGH)
//                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
//                .setContentIntent(contentIntent)
//
//                .setColor(Color.BLUE)
//                .addAction(R.drawable.ic_notification,"OK",
//                        actionIntent)
//                .build();
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this,  MainApplication.CHANNEL_2_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle("chgao b")
                .setContentText("nhuc chua")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        NotificationManagerCompat notificationManager =  NotificationManagerCompat.from(context);
        Notification noti = builder.build();
        notificationManager.notify(2, noti);
    }
    private void sendNotification(RemoteMessage.Notification notification, Map<String, String> data) {
        Bundle bundle = new Bundle();
        bundle.putString(FCM_PARAM, data.get(FCM_PARAM));

        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtras(bundle);

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, getString(R.string.notification_channel_id))
                .setContentTitle("nhuc")
                .setContentText("bod yde")
                .setAutoCancel(true)
                .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                //.setSound(Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.win))
                .setContentIntent(pendingIntent)
                .setContentInfo("Hello")
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
//                .setColor(getColor(R.color.colorAccent))
                .setLights(Color.RED, 1000, 300)
                .setDefaults(Notification.DEFAULT_VIBRATE)
                .setNumber(++numMessages)
                .setSmallIcon(R.drawable.ic_notification);

        try {
            notificationBuilder.setStyle(new NotificationCompat.BigTextStyle()
                    .bigText("a lodishjuierw"));
            String picture = data.get(FCM_PARAM);
            if (picture != null && !"".equals(picture)) {
                URL url = new URL(picture);
                Bitmap bigPicture = BitmapFactory.decodeStream(url.openConnection().getInputStream());
                notificationBuilder.setStyle(
                        new NotificationCompat.BigPictureStyle().bigPicture(bigPicture).setSummaryText("nhuc chuhcuc")
                );
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    getString(R.string.notification_channel_id), CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription(CHANNEL_DESC);
            channel.setShowBadge(true);
            channel.canShowBadge();
            channel.enableLights(true);
            channel.setLightColor(Color.RED);
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{100, 200, 300, 400, 500});

            assert notificationManager != null;
            notificationManager.createNotificationChannel(channel);
        }

        assert notificationManager != null;
        notificationManager.notify(0, notificationBuilder.build());
    }
}