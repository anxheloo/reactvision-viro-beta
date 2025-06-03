/**
 * ViroAnimatedImage
 *
 * A component for displaying animated images.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroAnimatedImageProps extends ViroCommonProps {
  // Image source
  source: { uri: string }[] | number[];

  // Animation properties
  loop?: boolean;
  delay?: number;
  visible?: boolean;
  opacity?: number;
  width?: number;
  height?: number;

  // Material properties
  materials?: string | string[];

  // Events
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
  onFinish?: () => void;
}

/**
 * ViroAnimatedImage is a component for displaying animated images.
 * It can be used to create simple animations by cycling through a series of images.
 */
export const ViroAnimatedImage: React.FC<ViroAnimatedImageProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    loop: props.loop,
    delay: props.delay,
    visible: props.visible,
    opacity: props.opacity,
    width: props.width,
    height: props.height,
    materials: props.materials,
    onLoadStart: props.onLoadStart ? true : undefined,
    onLoadEnd: props.onLoadEnd ? true : undefined,
    onError: props.onError ? true : undefined,
    onFinish: props.onFinish ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("animatedImage", nativeProps, "viro_root_scene");

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

    if (props.onFinish) {
      const callbackId = `${nodeId}_finish`;
      nativeViro.registerEventCallback(nodeId, "onFinish", callbackId);
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

      if (props.onFinish) {
        const callbackId = `${nodeId}_finish`;
        nativeViro.unregisterEventCallback(nodeId, "onFinish", callbackId);
      }
    };
  }, [
    nodeId,
    props.onLoadStart,
    props.onLoadEnd,
    props.onError,
    props.onFinish,
  ]);

  // Animated image doesn't have children, so just return null
  return null;
};
