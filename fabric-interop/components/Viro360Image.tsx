/**
 * Viro360Image
 *
 * A component for rendering 360-degree panoramic images.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface Viro360ImageProps extends ViroCommonProps {
  // Image source
  source: { uri: string } | number;

  // Visual properties
  format?: "RGBA8" | "RGB565";
  stereoMode?: "LeftRight" | "RightLeft" | "TopBottom" | "BottomTop" | "None";

  // Rotation
  rotation?: [number, number, number];

  // Events
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Viro360Image is a component for rendering 360-degree panoramic images.
 * It creates an immersive environment by wrapping an image around the user.
 */
export const Viro360Image: React.FC<Viro360ImageProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    format: props.format,
    stereoMode: props.stereoMode,
    rotation: props.rotation,
    onLoadStart: props.onLoadStart ? true : undefined,
    onLoadEnd: props.onLoadEnd ? true : undefined,
    onError: props.onError ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("360Image", nativeProps, "viro_root_scene");

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

  // 360 image doesn't have children, so just return null
  return null;
};
