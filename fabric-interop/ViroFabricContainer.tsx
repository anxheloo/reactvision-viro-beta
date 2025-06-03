/**
 * ViroFabricContainer
 *
 * This is the main container component that Fabric manages directly.
 * It serves as a viewport for the Viro rendering engine and delegates
 * rendering to the existing native implementation.
 */

import React, { useEffect, useRef } from "react";
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  Platform,
} from "react-native";

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

  // Initialize the Viro system when the component mounts
  useEffect(() => {
    if (containerRef.current) {
      const nodeHandle = findNodeHandle(containerRef.current);

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
    }

    // Cleanup when unmounting
    return () => {
      if (containerRef.current) {
        const nodeHandle = findNodeHandle(containerRef.current);

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
