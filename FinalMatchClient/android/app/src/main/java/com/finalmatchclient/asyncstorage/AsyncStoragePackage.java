package com.finalmatchclient.asyncstorage;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.finalmatchclient.notifications.NotificationModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class AsyncStoragePackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new AsyncStorage(reactContext));
        return modules;
    }

}