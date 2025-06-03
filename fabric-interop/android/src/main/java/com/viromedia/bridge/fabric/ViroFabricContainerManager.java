package com.viromedia.bridge.fabric;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

/**
 * ViewManager for the ViroFabricContainer component.
 */
@ReactModule(name = ViroFabricContainerManager.REACT_CLASS)
public class ViroFabricContainerManager extends ViewGroupManager<ViroFabricContainer> {

    public static final String REACT_CLASS = "ViroFabricContainer";

    // Commands
    private static final int COMMAND_INITIALIZE = 1;
    private static final int COMMAND_CLEANUP = 2;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ViroFabricContainer createViewInstance(ThemedReactContext reactContext) {
        return new ViroFabricContainer(reactContext);
    }

    @Override
    public void onDropViewInstance(ViroFabricContainer view) {
        view.cleanup();
        super.onDropViewInstance(view);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onInitialized", MapBuilder.of("registrationName", "onInitialized"))
                .put("onTrackingUpdated", MapBuilder.of("registrationName", "onTrackingUpdated"))
                .put("onCameraTransformUpdate", MapBuilder.of("registrationName", "onCameraTransformUpdate"))
                .build();
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "initialize", COMMAND_INITIALIZE,
                "cleanup", COMMAND_CLEANUP
        );
    }

    @Override
    public void receiveCommand(@NonNull ViroFabricContainer view, String commandId, @Nullable ReadableArray args) {
        int commandIdInt = Integer.parseInt(commandId);
        switch (commandIdInt) {
            case COMMAND_INITIALIZE:
                if (args != null) {
                    String apiKey = args.getString(0);
                    boolean debug = args.getBoolean(1);
                    boolean arEnabled = args.getBoolean(2);
                    String worldAlignment = args.getString(3);
                    view.initialize(apiKey, debug, arEnabled, worldAlignment);
                }
                break;
            case COMMAND_CLEANUP:
                view.cleanup();
                break;
        }
    }

    @Override
    public void receiveCommand(@NonNull ViroFabricContainer view, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_INITIALIZE:
                if (args != null) {
                    String apiKey = args.getString(0);
                    boolean debug = args.getBoolean(1);
                    boolean arEnabled = args.getBoolean(2);
                    String worldAlignment = args.getString(3);
                    view.initialize(apiKey, debug, arEnabled, worldAlignment);
                }
                break;
            case COMMAND_CLEANUP:
                view.cleanup();
                break;
        }
    }
}
