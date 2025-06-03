/**
 * ViroLightingEnvironment
 *
 * A component for creating realistic lighting environments.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroLightingEnvironmentProps extends ViroCommonProps {
  // Source for the environment map
  source: { uri: string } | number;

  // Visual properties
  influenceBitMask?: number;
  intensity?: number;

  // Events
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * ViroLightingEnvironment is a component for creating realistic lighting environments.
 * It uses an environment map to provide realistic reflections and lighting for PBR materials.
 */
export const ViroLightingEnvironment: React.FC<ViroLightingEnvironmentProps> = (
  props
) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    influenceBitMask: props.influenceBitMask,
    intensity: props.intensity,
    onLoadStart: props.onLoadStart ? true : undefined,
    onLoadEnd: props.onLoadEnd ? true : undefined,
    onError: props.onError ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode(
    "lightingEnvironment",
    nativeProps,
    "viro_root_scene"
  );

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Register event handlers if provided
    if (props.onLoadStart) {
      const callbackId = `${nodeId}_load_start`;
      nativeViro.registerEventCallback(nodeId, "onLoadStart", callbackId);
    }

    if (props.onLoadEnd) {
      const callbackId = `${nodeId}_load_end`;
      nativeViro.registerEventCallback(nodeId, "onLoadEnd", callbackId);
    }

    if (props.onError) {
      const callbackId = `${nodeId}_error`;
      nativeViro.registerEventCallback(nodeId, "onError", callbackId);
    }

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro) return;

      if (props.onLoadStart) {
        const callbackId = `${nodeId}_load_start`;
        nativeViro.unregisterEventCallback(nodeId, "onLoadStart", callbackId);
      }

      if (props.onLoadEnd) {
        const callbackId = `${nodeId}_load_end`;
        nativeViro.unregisterEventCallback(nodeId, "onLoadEnd", callbackId);
      }

      if (props.onError) {
        const callbackId = `${nodeId}_error`;
        nativeViro.unregisterEventCallback(nodeId, "onError", callbackId);
      }
    };
  }, [nodeId, props.onLoadStart, props.onLoadEnd, props.onError]);

  // Lighting environment doesn't have children, so just return null
  return null;
};
