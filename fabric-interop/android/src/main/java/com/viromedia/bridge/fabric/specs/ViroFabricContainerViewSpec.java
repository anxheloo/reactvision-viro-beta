package com.viromedia.bridge.fabric.specs;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.ViroFabricContainerViewManagerInterface;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * Spec class for ViroFabricContainerView.
 * This class is used by React Native's Codegen system to generate the necessary code for the Fabric architecture.
 */
public abstract class ViroFabricContainerViewSpec<T extends View> extends BaseViewManager<T, ViewManagerDelegate<T>> {

    public static final String NAME = "ViroFabricContainerView";

    @ReactProp(name = "apiKey")
    public abstract void setApiKey(T view, @Nullable String apiKey);

    @ReactProp(name = "debug")
    public abstract void setDebug(T view, boolean debug);

    @ReactProp(name = "arEnabled")
    public abstract void setArEnabled(T view, boolean arEnabled);

    @ReactProp(name = "worldAlignment")
    public abstract void setWorldAlignment(T view, @Nullable String worldAlignment);

    public abstract void initialize(T view, String apiKey, boolean debug, boolean arEnabled, String worldAlignment);

    public abstract void cleanup(T view);
}
