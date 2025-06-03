/**
 * Viro3DObject
 *
 * A component for loading and displaying 3D models in various formats.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface Viro3DObjectProps extends ViroCommonProps {
  // 3D model source
  source: { uri: string } | number;

  // Resources
  resources?: ({ uri: string } | number)[];

  // Model properties
  type: "OBJ" | "VRX" | "GLTF" | "GLB" | "FBX";
  position?: [number, number, number];
  scale?: [number, number, number] | number;
  rotation?: [number, number, number];

  // Materials
  materials?: string | string[];

  // Morphing
  morphTargets?: {
    [key: string]: number;
  };

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

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;

  // Physics props
  highAccuracyEvents?: boolean;
  physicsBody?: {
    type: "Dynamic" | "Kinematic" | "Static";
    mass?: number;
    restitution?: number;
    shape?: {
      type: "Box" | "Sphere" | "Compound";
      params?: number[];
    };
    friction?: number;
    useGravity?: boolean;
    enabled?: boolean;
    velocity?: [number, number, number];
    force?: {
      value: [number, number, number];
      position: [number, number, number];
    };
    torque?: [number, number, number];
  };

  // Events
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Viro3DObject is a component for loading and displaying 3D models in various formats.
 */
export const Viro3DObject: React.FC<Viro3DObjectProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    resources: props.resources,
    type: props.type,
    materials: props.materials,
    morphTargets: props.morphTargets,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
    highAccuracyEvents: props.highAccuracyEvents,
    physicsBody: props.physicsBody,
    onLoadStart: props.onLoadStart ? true : undefined,
    onLoadEnd: props.onLoadEnd ? true : undefined,
    onError: props.onError ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("object", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    if (!global.NativeViro) return;

    // Register event handlers if provided
    if (props.onLoadStart) {
      const callbackId = `${nodeId}_load_start`;
      global.NativeViro.registerEventCallback(
        nodeId,
        "onLoadStart",
        callbackId
      );
    }

    if (props.onLoadEnd) {
      const callbackId = `${nodeId}_load_end`;
      global.NativeViro.registerEventCallback(nodeId, "onLoadEnd", callbackId);
    }

    if (props.onError) {
      const callbackId = `${nodeId}_error`;
      global.NativeViro.registerEventCallback(nodeId, "onError", callbackId);
    }

    // Cleanup when unmounting
    return () => {
      if (!global.NativeViro) return;

      if (props.onLoadStart) {
        const callbackId = `${nodeId}_load_start`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onLoadStart",
          callbackId
        );
      }

      if (props.onLoadEnd) {
        const callbackId = `${nodeId}_load_end`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onLoadEnd",
          callbackId
        );
      }

      if (props.onError) {
        const callbackId = `${nodeId}_error`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onError",
          callbackId
        );
      }
    };
  }, [nodeId, props.onLoadStart, props.onLoadEnd, props.onError]);

  // 3D Object doesn't have children, so just return null
  return null;
};
