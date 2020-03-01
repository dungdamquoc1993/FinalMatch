package com.finalmatchforsupplier;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    public  static final String CHANNEL_1_ID = "channel1";
    public  static final String CHANNEL_2_ID = "channel2";
  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          // packages.add(new ReactNativePushNotificationPackage());
            createNotificationChannels();
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };
  private void createNotificationChannels() {
      if(Build.VERSION.SDK_INT > Build.VERSION_CODES.O) {
          NotificationChannel channel1 = new NotificationChannel(
                  CHANNEL_1_ID,
                  "Channel 1",
                  NotificationManager.IMPORTANCE_HIGH
          );
          channel1.setDescription("This is channel 1 ");
          NotificationChannel channel2 = new NotificationChannel(
                  CHANNEL_2_ID,
                  "Channel 2",
                  NotificationManager.IMPORTANCE_LOW
          );
          channel1.setDescription("This is channel 2 ");
          NotificationManager manager = getSystemService(NotificationManager.class);
          manager.createNotificationChannel(channel1);
          manager.createNotificationChannel(channel2);
      }
  }
  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
