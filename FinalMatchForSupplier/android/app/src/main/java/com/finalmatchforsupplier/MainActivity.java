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
          /*
          LinearLayout layout = new LinearLayout(this);
          layout.setOrientation(LinearLayout.VERTICAL);
          layout.setLayoutParams(
                  new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
                  LinearLayout.LayoutParams.MATCH_PARENT)
          );
          Button btn = new Button(this);
          btn.setText("Bam VAO DAY");
          btn.setOnClickListener(new View.OnClickListener() {
              @Override
              public void onClick(View view) {
                  notificationManager = NotificationManagerCompat.from(MainActivity.this);
                  pushLocalNotification("haha", "Day la 1 noti");
              }
          });
          layout.addView(btn);
          setContentView(layout);
            */
      } catch (PackageManager.NameNotFoundException e) {

      } catch (NoSuchAlgorithmException e) {

      }
  }


  @Override
  protected String getMainComponentName() {
    return "FinalMatchForSupplier";
  }
}
