package com.viromedia.bridge.fabric;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Package for registering the ViroFabricContainer components.
 */
public class ViroFabricPackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        // No native modules to create
        return Collections.emptyList();
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        
        // Add the legacy view manager for backward compatibility
        viewManagers.add(new ViroFabricContainerManager(reactContext));
        
        // Add the Fabric view manager
        viewManagers.add(new ViroFabricContainerViewManager());
        
        return viewManagers;
    }
}
