/**
 * ViroARCamera
 *
 * A component for controlling the camera in an AR scene.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

// Custom type for transform update event
export type ViroARCameraTransformUpdateEvent = {
  position: [number, number, number];
  rotation: [number, number, number];
  forward: [number, number, number];
  up: [number, number, number];
};

// Custom type for tracking state update event
export type ViroARTrackingStateEvent = {
  state: "NORMAL" | "LIMITED" | "NOT_AVAILABLE";
  reason?:
    | "NONE"
    | "INITIALIZING"
    | "EXCESSIVE_MOTION"
    | "INSUFFICIENT_FEATURES";
};

export interface ViroARCameraProps
  extends Omit<ViroCommonProps, "onTransformUpdate"> {
  // Camera properties
  active?: boolean;

  // Events with specific types
  onTransformUpdate?: (event: ViroARCameraTransformUpdateEvent) => void;
  onTrackingUpdated?: (event: ViroARTrackingStateEvent) => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroARCamera is a component for controlling the camera in an AR scene.
 * It provides information about the camera's position and orientation in the real world,
 * as well as tracking state updates.
 */
export const ViroARCamera: React.FC<ViroARCameraProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    active: props.active,
    onTransformUpdate: props.onTransformUpdate ? true : undefined,
    onTrackingUpdated: props.onTrackingUpdated ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("arCamera", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Register event handlers if provided
    if (props.onTransformUpdate) {
      const callbackId = `${nodeId}_transform_update`;
      nativeViro.registerEventCallback(nodeId, "onTransformUpdate", callbackId);
    }

    if (props.onTrackingUpdated) {
      const callbackId = `${nodeId}_tracking_updated`;
      nativeViro.registerEventCallback(nodeId, "onTrackingUpdated", callbackId);
    }

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro) return;

      if (props.onTransformUpdate) {
        const callbackId = `${nodeId}_transform_update`;
        nativeViro.unregisterEventCallback(
          nodeId,
          "onTransformUpdate",
          callbackId
        );
      }

      if (props.onTrackingUpdated) {
        const callbackId = `${nodeId}_tracking_updated`;
        nativeViro.unregisterEventCallback(
          nodeId,
          "onTrackingUpdated",
          callbackId
        );
      }
    };
  }, [nodeId, props.onTransformUpdate, props.onTrackingUpdated]);

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
