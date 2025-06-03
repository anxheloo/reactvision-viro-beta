/**
 * ViroSpatialSound
 *
 * A component for creating spatial audio in 3D space.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroSpatialSoundProps extends ViroCommonProps {
  // Sound source
  source: { uri: string } | number;

  // Playback properties
  paused?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;

  // Spatial properties
  rolloffModel?: "None" | "Linear" | "Logarithmic" | "Exponential";
  minDistance?: number;
  maxDistance?: number;

  // Events
  onFinish?: () => void;
  onError?: (error: string) => void;
}

/**
 * ViroSpatialSound is a component for creating spatial audio in 3D space.
 * It allows you to place sounds at specific positions in the 3D environment.
 */
export const ViroSpatialSound: React.FC<ViroSpatialSoundProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    paused: props.paused,
    loop: props.loop,
    muted: props.muted,
    volume: props.volume,
    rolloffModel: props.rolloffModel,
    minDistance: props.minDistance,
    maxDistance: props.maxDistance,
    onFinish: props.onFinish ? true : undefined,
    onError: props.onError ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("spatialSound", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Register event handlers if provided
    if (props.onFinish) {
      const callbackId = `${nodeId}_finish`;
      nativeViro.registerEventCallback(nodeId, "onFinish", callbackId);
    }

    if (props.onError) {
      const callbackId = `${nodeId}_error`;
      nativeViro.registerEventCallback(nodeId, "onError", callbackId);
    }

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro) return;

      if (props.onFinish) {
        const callbackId = `${nodeId}_finish`;
        nativeViro.unregisterEventCallback(nodeId, "onFinish", callbackId);
      }

      if (props.onError) {
        const callbackId = `${nodeId}_error`;
        nativeViro.unregisterEventCallback(nodeId, "onError", callbackId);
      }
    };
  }, [nodeId, props.onFinish, props.onError]);

  // Spatial sound doesn't have children, so just return null
  return null;
};
