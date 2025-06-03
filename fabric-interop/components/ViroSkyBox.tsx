/**
 * ViroSkyBox
 *
 * A component for creating a skybox environment.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroSkyBoxProps extends ViroCommonProps {
  // Skybox source - can be either a single 360 image or 6 separate images for each face
  source?: {
    nx?: { uri: string } | number;
    px?: { uri: string } | number;
    ny?: { uri: string } | number;
    py?: { uri: string } | number;
    nz?: { uri: string } | number;
    pz?: { uri: string } | number;
  };

  // Alternative: use a single 360 image
  source360?: { uri: string } | number;

  // Visual properties
  format?: "RGBA8" | "RGB565";

  // Events
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * ViroSkyBox is a component for creating a skybox environment.
 * It creates a cube with textures on each face to simulate a distant environment.
 */
export const ViroSkyBox: React.FC<ViroSkyBoxProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    source360: props.source360,
    format: props.format,
    onLoadStart: props.onLoadStart ? true : undefined,
    onLoadEnd: props.onLoadEnd ? true : undefined,
    onError: props.onError ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("skyBox", nativeProps, "viro_root_scene");

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

  // Skybox doesn't have children, so just return null
  return null;
};
