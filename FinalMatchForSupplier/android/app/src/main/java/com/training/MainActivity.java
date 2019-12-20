package com.training;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FinalMatchForSupplier";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
      try {
          PackageInfo info = getPackageManager().getPackageInfo(
                  "com.FinalMatch",
                  PackageManager.GET_SIGNATURES);
          for (Signature signature : info.signatures) {
              MessageDigest md = MessageDigest.getInstance("SHA");
              md.update(signature.toByteArray());
              Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
              Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
          }
      } catch (PackageManager.NameNotFoundException e) {

      } catch (NoSuchAlgorithmException e) {

      }
  }
}
