package com.finalmatchclient.asyncstorage;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.finalmatchclient.MainActivity;
import com.finalmatchclient.MainApplication;
import com.finalmatchforsupplier.MyBroadcastReceiver;
import com.finalmatchclient.R;

import java.util.Map;
import java.util.HashMap;

import static android.content.Context.MODE_APPEND;
import static android.content.Context.MODE_PRIVATE;

public class AsyncStorage extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public AsyncStorage(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @ReactMethod
    public void setItem(String itemName, String value, Promise promise) {
        Context context = getCurrentActivity();
        SharedPreferences sharedPreferences = getCurrentActivity().getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(itemName, value);
        editor.commit();
        promise.resolve(true);
    }
    @ReactMethod
    public void getItem(String itemName, Promise promise) {
        SharedPreferences sharedPreferences = getCurrentActivity().getPreferences(Context.MODE_PRIVATE);;
        promise.resolve(sharedPreferences.getString(itemName, ""));
    }
    @Override
    public String getName() {
        return "AsyncStorage";

    }
}
