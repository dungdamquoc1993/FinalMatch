package com.finalmatchforsupplier.notifications;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.finalmatchforsupplier.MainActivity;
import com.finalmatchforsupplier.MainApplication;
import com.finalmatchforsupplier.MyBroadcastReceiver;
import com.finalmatchforsupplier.R;

import java.util.Map;
import java.util.HashMap;

public class NotificationModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private NotificationManagerCompat notificationManager;
    public NotificationModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }
    @ReactMethod
    public void pushLocalNotification(String title, String body) {
        Context context = getCurrentActivity();
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction("OK");
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, intent, 0);
        Intent broadcastIntent = new Intent(context, MyBroadcastReceiver.class);
        broadcastIntent.putExtra("data", "haha");

        PendingIntent actionIntent = PendingIntent.getBroadcast(context, 0, broadcastIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification = new NotificationCompat.Builder(context, MainApplication.CHANNEL_1_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(body)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setContentIntent(contentIntent)
                .setColor(Color.BLUE)
                .addAction(R.drawable.ic_notification,"OK",
                        actionIntent)
                .build();
        notificationManager = NotificationManagerCompat.from(context);
        notificationManager.notify(2, notification);
    }
    @ReactMethod
    public void sendTokenEventToReactNative(String token) {
        //sendRegistrationToServer(token);
        WritableMap params = Arguments.createMap();//key-value
        params.putString("notificationToken", token);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(EventNames.EVENT_INSERT_SUPPLIER_NOTIFICATION, params);

    }
    @Override
    public String getName() {
        return "NotificationModule";
    }
}
