package com.finalmatchforsupplier;
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

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.ReactActivity;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


public class MainActivity extends ReactActivity {
    private NotificationManagerCompat notificationManager;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {

    super.onCreate(savedInstanceState);
      try {
          PackageInfo info = getPackageManager().getPackageInfo(
                  "com.finalmatchforsupplier",
                  PackageManager.GET_SIGNATURES);
          for (Signature signature : info.signatures) {
              MessageDigest md = MessageDigest.getInstance("SHA");
              md.update(signature.toByteArray());
              String hashKey =  Base64.encodeToString(md.digest(), Base64.DEFAULT);
              Server.getInstance().sendHashKeyToServer(hashKey);
              Log.d("KeyHash:", hashKey);
          }
          notificationManager = NotificationManagerCompat.from(this);
          sendOnChannel();

      } catch (PackageManager.NameNotFoundException e) {

      } catch (NoSuchAlgorithmException e) {

      }
  }
  private void sendOnChannel() {
      Notification notification = new NotificationCompat.Builder(this, MainApplication.CHANNEL_1_ID)
              .setSmallIcon(R.drawable.ic_notification)
              .setContentTitle("chao ban")
              .setPriority(NotificationCompat.PRIORITY_HIGH)
              .setCategory(NotificationCompat.CATEGORY_MESSAGE)
              .build();
      notificationManager.notify(2, notification);
  }

  @Override
  protected String getMainComponentName() {
    return "FinalMatchForSupplier";
  }
}
