/**
 * ViroOrbitCamera
 *
 * A specialized camera that orbits around a target point.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

// Custom type for transform update event
export type ViroOrbitCameraTransformUpdateEvent = {
  position: [number, number, number];
  rotation: [number, number, number];
};

export interface ViroOrbitCameraProps
  extends Omit<ViroCommonProps, "onTransformUpdate"> {
  // Camera properties
  position?: [number, number, number];
  active?: boolean;
  fieldOfView?: number;

  // Orbit properties
  focalPoint?: [number, number, number];
  focalDistance?: number;

  // Control properties
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  enableFling?: boolean;

  // Constraints
  minZoom?: number;
  maxZoom?: number;
  minPan?: [number, number, number];
  maxPan?: [number, number, number];
  minRotation?: [number, number, number];
  maxRotation?: [number, number, number];

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
  onTransformUpdate?: (event: ViroOrbitCameraTransformUpdateEvent) => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroOrbitCamera is a specialized camera that orbits around a target point.
 * It provides controls for zooming, panning, and rotating around the focal point.
 */
export const ViroOrbitCamera: React.FC<ViroOrbitCameraProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    position: props.position,
    active: props.active,
    fieldOfView: props.fieldOfView,
    focalPoint: props.focalPoint,
    focalDistance: props.focalDistance,
    enableZoom: props.enableZoom,
    enablePan: props.enablePan,
    enableRotate: props.enableRotate,
    enableFling: props.enableFling,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    minPan: props.minPan,
    maxPan: props.maxPan,
    minRotation: props.minRotation,
    maxRotation: props.maxRotation,
    onTransformUpdate: props.onTransformUpdate ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("orbitCamera", nativeProps, "viro_root_scene");

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
