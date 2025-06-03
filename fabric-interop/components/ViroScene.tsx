/**
 * ViroScene
 *
 * A container for 3D content in the Viro scene graph.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroSceneProps extends ViroCommonProps {
  // Scene-specific props
  displayPointCloud?: boolean;
  pointCloudColor?: string;
  pointCloudSize?: number;

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;

  // Physics props
  physicsWorld?: {
    gravity?: [number, number, number];
  };

  // Post-processing props
  postProcessEffects?: string[];

  // Event callbacks
  onPlatformUpdate?: (event: any) => void;
  onCameraTransformUpdate?: (event: any) => void;
  onAmbientLightUpdate?: (event: any) => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroScene is a container for 3D content in the Viro scene graph.
 */
export const ViroScene: React.FC<ViroSceneProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    displayPointCloud: props.displayPointCloud,
    pointCloudColor: props.pointCloudColor,
    pointCloudSize: props.pointCloudSize,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
    physicsWorld: props.physicsWorld,
    postProcessEffects: props.postProcessEffects,
    onPlatformUpdate: props.onPlatformUpdate ? true : undefined,
    onCameraTransformUpdate: props.onCameraTransformUpdate ? true : undefined,
    onAmbientLightUpdate: props.onAmbientLightUpdate ? true : undefined,
  };

  // Create the scene node - this is a root node, so no parent
  const nodeId = useViroNode("scene", nativeProps);

  // Register event handlers
  React.useEffect(() => {
    if (!global.NativeViro) return;

    // Register event handlers if provided
    if (props.onPlatformUpdate) {
      const callbackId = `${nodeId}_platform_update`;
      global.NativeViro.registerEventCallback(
        nodeId,
        "onPlatformUpdate",
        callbackId
      );
    }

    if (props.onCameraTransformUpdate) {
      const callbackId = `${nodeId}_camera_transform_update`;
      global.NativeViro.registerEventCallback(
        nodeId,
        "onCameraTransformUpdate",
        callbackId
      );
    }

    if (props.onAmbientLightUpdate) {
      const callbackId = `${nodeId}_ambient_light_update`;
      global.NativeViro.registerEventCallback(
        nodeId,
        "onAmbientLightUpdate",
        callbackId
      );
    }

    // Cleanup when unmounting
    return () => {
      if (!global.NativeViro) return;

      if (props.onPlatformUpdate) {
        const callbackId = `${nodeId}_platform_update`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onPlatformUpdate",
          callbackId
        );
      }

      if (props.onCameraTransformUpdate) {
        const callbackId = `${nodeId}_camera_transform_update`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onCameraTransformUpdate",
          callbackId
        );
      }

      if (props.onAmbientLightUpdate) {
        const callbackId = `${nodeId}_ambient_light_update`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onAmbientLightUpdate",
          callbackId
        );
      }
    };
  }, [
    nodeId,
    props.onPlatformUpdate,
    props.onCameraTransformUpdate,
    props.onAmbientLightUpdate,
  ]);

  // Render children with this scene as their parent
  return (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  );
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
