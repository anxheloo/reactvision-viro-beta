/**
 * ViroCamera
 *
 * A component for controlling the camera in a scene.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

// Custom type for transform update event
export type ViroCameraTransformUpdateEvent = {
  position: [number, number, number];
  rotation: [number, number, number];
};

export interface ViroCameraProps
  extends Omit<ViroCommonProps, "onTransformUpdate"> {
  // Camera properties
  position?: [number, number, number];
  rotation?: [number, number, number];
  active?: boolean;
  fieldOfView?: number;

  // Animation
  animation?: {
    name?: string;
    delay?: number;
    loop?: boolean;
    onStart?: () => void;
    onFinish?: () => void;
    run?: boolean;
    interruptible?: boolean;
  };

  // Events with specific type
  onTransformUpdate?: (event: ViroCameraTransformUpdateEvent) => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroCamera is a component for controlling the camera in a scene.
 * It defines the viewpoint from which the scene is rendered.
 */
export const ViroCamera: React.FC<ViroCameraProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    position: props.position,
    rotation: props.rotation,
    active: props.active,
    fieldOfView: props.fieldOfView,
    onTransformUpdate: props.onTransformUpdate ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("camera", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    if (!global.NativeViro) return;

    // Register event handlers if provided
    if (props.onTransformUpdate) {
      const callbackId = `${nodeId}_transform_update`;
      global.NativeViro.registerEventCallback(
        nodeId,
        "onTransformUpdate",
        callbackId
      );
    }

    // Cleanup when unmounting
    return () => {
      if (!global.NativeViro) return;

      if (props.onTransformUpdate) {
        const callbackId = `${nodeId}_transform_update`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onTransformUpdate",
          callbackId
        );
      }
    };
  }, [nodeId, props.onTransformUpdate]);

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
