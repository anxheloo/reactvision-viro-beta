/**
 * ViroFabricContainer
 *
 * This is the main container component that Fabric manages directly.
 * It serves as a viewport for the Viro rendering engine and delegates
 * rendering to the existing native implementation.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  Platform,
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
} from "react-native";

// Check if New Architecture is enabled
const isNewArchitectureEnabled = () => {
  if (global.__turboModuleProxy == null) {
    throw new Error(
      "Viro: New Architecture is not enabled. This library requires React Native New Architecture. " +
        "Please enable it in your app by following the instructions at: " +
        "https://reactnative.dev/docs/new-architecture-intro"
    );
  }
  return true;
};

// Check if the component exists in UIManager
const isFabricComponentAvailable = () => {
  isNewArchitectureEnabled(); // This will throw if New Architecture is not enabled

  if (
    !UIManager.getViewManagerConfig ||
    UIManager.getViewManagerConfig("ViroFabricContainer") == null
  ) {
    throw new Error(
      "ViroFabricContainer is not available. Make sure you have installed the native module properly."
    );
  }

  return true;
};

// Define the native component
// @ts-ignore - TypeScript doesn't know about the props of the native component
const NativeViroFabricContainer = requireNativeComponent<any>(
  "ViroFabricContainer"
);

// Props for the container
export interface ViroFabricContainerProps {
  // General props
  apiKey?: string;
  debug?: boolean;
  style?: React.CSSProperties;

  // AR specific props
  arEnabled?: boolean;
  autofocus?: boolean;
  worldAlignment?: "Gravity" | "GravityAndHeading" | "Camera";
  videoQuality?: "High" | "Low";

  // Event callbacks
  onInitialized?: (success: boolean) => void;
  onTrackingUpdated?: (state: any) => void;
  onCameraTransformUpdate?: (transform: any) => void;
  onARSessionFailed?: (error: string) => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroFabricContainer is the main component that hosts the Viro rendering engine.
 * It creates a native view that the Viro renderer can draw on and manages the
 * lifecycle of the Viro system.
 */
export const ViroFabricContainer: React.FC<ViroFabricContainerProps> = ({
  apiKey,
  debug = false,
  arEnabled = false,
  worldAlignment = "Gravity",
  onInitialized,
  onTrackingUpdated,
  onCameraTransformUpdate,
  children,
}) => {
  // Reference to the native component
  const containerRef = useRef<any>(null);

  // Root node ID for the scene
  const rootNodeId = useRef<string>("viro_root_scene");

  // Event callback registry
  const eventCallbacks = useRef<Record<string, (event: any) => void>>({});

  // Set up event handling for fallback event emitter approach
  useEffect(() => {
    // Set up global event handler for JSI events
    if (typeof global !== "undefined") {
      // @ts-ignore - This property will be added by the native code
      global.handleViroEvent = (callbackId: string, eventData: any) => {
        // Find the callback in the registry and call it
        const callback = eventCallbacks.current[callbackId];
        if (callback) {
          callback(eventData);
        }
      };
    }

    // Set up event emitter for fallback approach
    const eventEmitter = new NativeEventEmitter(
      NativeModules.ViroFabricManager
    );
    const subscription = eventEmitter.addListener("ViroEvent", (event) => {
      const { callbackId, data } = event;
      const callback = eventCallbacks.current[callbackId];
      if (callback) {
        callback(data);
      }
    });

    return () => {
      subscription.remove();
      // Clean up global event handler
      if (typeof global !== "undefined") {
        // @ts-ignore - This property was added by us
        delete global.handleViroEvent;
      }
    };
  }, []);

  // Initialize the Viro system when the component mounts
  useEffect(() => {
    if (containerRef.current && isFabricComponentAvailable()) {
      const nodeHandle = findNodeHandle(containerRef.current);

      try {
        // Call the native method to initialize
        if (Platform.OS === "ios") {
          UIManager.dispatchViewManagerCommand(
            nodeHandle,
            UIManager.getViewManagerConfig("ViroFabricContainer").Commands
              .initialize,
            [apiKey, debug, arEnabled, worldAlignment]
          );
        } else {
          // Android
          UIManager.dispatchViewManagerCommand(
            nodeHandle,
            // @ts-ignore - This property exists at runtime but TypeScript doesn't know about it
            UIManager.ViroFabricContainer.Commands.initialize.toString(),
            [apiKey, debug, arEnabled, worldAlignment]
          );
        }
      } catch (error) {
        console.error("Failed to initialize ViroFabricContainer:", error);
      }
    }

    // Cleanup when unmounting
    return () => {
      if (containerRef.current && isFabricComponentAvailable()) {
        const nodeHandle = findNodeHandle(containerRef.current);

        try {
          // Call the native method to cleanup
          if (Platform.OS === "ios") {
            UIManager.dispatchViewManagerCommand(
              nodeHandle,
              UIManager.getViewManagerConfig("ViroFabricContainer").Commands
                .cleanup,
              []
            );
          } else {
            // Android
            UIManager.dispatchViewManagerCommand(
              nodeHandle,
              // @ts-ignore - This property exists at runtime but TypeScript doesn't know about it
              UIManager.ViroFabricContainer.Commands.cleanup.toString(),
              []
            );
          }
        } catch (error) {
          console.error("Failed to cleanup ViroFabricContainer:", error);
        }
      }
    };
  }, [apiKey, debug, arEnabled, worldAlignment]);

  // Handle initialization event
  const handleInitialized = (event: any) => {
    if (onInitialized) {
      onInitialized(event.nativeEvent.success);
    }
  };

  // Handle tracking updated event
  const handleTrackingUpdated = (event: any) => {
    if (onTrackingUpdated) {
      onTrackingUpdated(event.nativeEvent);
    }
  };

  // Handle camera transform update event
  const handleCameraTransformUpdate = (event: any) => {
    if (onCameraTransformUpdate) {
      onCameraTransformUpdate(event.nativeEvent);
    }
  };

  // This will throw an error if the native component is not available or New Architecture is not enabled
  isFabricComponentAvailable();

  return (
    <NativeViroFabricContainer
      ref={containerRef}
      style={{ flex: 1 }}
      onInitialized={handleInitialized}
      onTrackingUpdated={handleTrackingUpdated}
      onCameraTransformUpdate={handleCameraTransformUpdate}
    >
      {children}
    </NativeViroFabricContainer>
  );
};
