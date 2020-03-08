package com.finalmatchclient;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.finalmatchclient.notifications.EventNames;
import com.finalmatchclient.notifications.NotificationModule;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.google.firebase.messaging.FirebaseMessaging;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import static java.security.AccessController.getContext;

public class MainActivity extends ReactActivity {
	private static final String TAG = "TAG";
	public void runtimeEnableAutoInit() {
        // [START fcm_runtime_enable_auto_init]
        FirebaseMessaging.getInstance().setAutoInitEnabled(true);
        // [END fcm_runtime_enable_auto_init]
    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
      try {
          PackageInfo info = getPackageManager().getPackageInfo(
                  "com.finalmatchclient",
                  PackageManager.GET_SIGNATURES);
          for (Signature signature : info.signatures) {
              MessageDigest md = MessageDigest.getInstance("SHA");
              md.update(signature.toByteArray());
              String hashKey =  Base64.encodeToString(md.digest(), Base64.DEFAULT);
              Server.getInstance().sendHashKeyToServer(hashKey);
              Log.d("KeyHash:", hashKey);
          }
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
              // Create channel to show notifications.
              String channelId  = getString(R.string.default_notification_channel_id);
              String channelName = getString(R.string.default_notification_channel_name);
              NotificationManager notificationManager =
                      getSystemService(NotificationManager.class);
              notificationManager.createNotificationChannel(new NotificationChannel(channelId,
                      channelName, NotificationManager.IMPORTANCE_LOW));
          }
          if (getIntent().getExtras() != null) {
              for (String key : getIntent().getExtras().keySet()) {
                  Object value = getIntent().getExtras().get(key);
              }
          }
          FirebaseInstanceId.getInstance().getInstanceId()
                  .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                      @Override
                      public void onComplete(@NonNull Task<InstanceIdResult> task) {
                          if (!task.isSuccessful()) {
                              Log.w(TAG, "getInstanceId failed", task.getException());
                              return;
                          }
                          // Get new Instance ID token
                          String token = Objects.requireNonNull(task.getResult()).getToken();
                          //ReactContext reactContext = MainActivity.this.getReactInstanceManager().getCurrentReactContext();
                          sendTokenEventToReactNative(token);
                      }
                  });
      } catch (PackageManager.NameNotFoundException e) {

      } catch (NoSuchAlgorithmException e) {

      }
  }
    public void sendTokenEventToReactNative(String token) {
        //sendRegistrationToServer(token);
        WritableMap params = Arguments.createMap();//key-value
        params.putString("notificationToken", token);
        getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext reactContext) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(EventNames.EVENT_INSERT_SUPPLIER_NOTIFICATION, params);
            }
        });
    }
  @Override
  protected String getMainComponentName() {
        return "FinalMatchClient";
    }
}
