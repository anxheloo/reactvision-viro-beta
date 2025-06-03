/**
 * Viro360Video
 *
 * A component for rendering 360-degree panoramic videos.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface Viro360VideoProps extends ViroCommonProps {
  // Video source
  source: { uri: string } | number;

  // Playback properties
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  paused?: boolean;

  // Visual properties
  stereoMode?: "LeftRight" | "RightLeft" | "TopBottom" | "BottomTop" | "None";

  // Events
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
  onFinish?: () => void;
  onUpdateTime?: (currentTime: number, totalTime: number) => void;
  onBufferStart?: () => void;
  onBufferEnd?: () => void;
}

/**
 * Viro360Video is a component for rendering 360-degree panoramic videos.
 * It creates an immersive environment by wrapping a video around the user.
 */
export const Viro360Video: React.FC<Viro360VideoProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    loop: props.loop,
    muted: props.muted,
    volume: props.volume,
    paused: props.paused,
    stereoMode: props.stereoMode,
    onLoadStart: props.onLoadStart ? true : undefined,
    onLoadEnd: props.onLoadEnd ? true : undefined,
    onError: props.onError ? true : undefined,
    onFinish: props.onFinish ? true : undefined,
    onUpdateTime: props.onUpdateTime ? true : undefined,
    onBufferStart: props.onBufferStart ? true : undefined,
    onBufferEnd: props.onBufferEnd ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("360Video", nativeProps, "viro_root_scene");

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

    if (props.onUpdateTime) {
      const callbackId = `${nodeId}_update_time`;
      nativeViro.registerEventCallback(nodeId, "onUpdateTime", callbackId);
    }

    if (props.onBufferStart) {
      const callbackId = `${nodeId}_buffer_start`;
      nativeViro.registerEventCallback(nodeId, "onBufferStart", callbackId);
    }

    if (props.onBufferEnd) {
      const callbackId = `${nodeId}_buffer_end`;
      nativeViro.registerEventCallback(nodeId, "onBufferEnd", callbackId);
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

      if (props.onUpdateTime) {
        const callbackId = `${nodeId}_update_time`;
        nativeViro.unregisterEventCallback(nodeId, "onUpdateTime", callbackId);
      }

      if (props.onBufferStart) {
        const callbackId = `${nodeId}_buffer_start`;
        nativeViro.unregisterEventCallback(nodeId, "onBufferStart", callbackId);
      }

      if (props.onBufferEnd) {
        const callbackId = `${nodeId}_buffer_end`;
        nativeViro.unregisterEventCallback(nodeId, "onBufferEnd", callbackId);
      }
    };
  }, [
    nodeId,
    props.onLoadStart,
    props.onLoadEnd,
    props.onError,
    props.onFinish,
    props.onUpdateTime,
    props.onBufferStart,
    props.onBufferEnd,
  ]);

  // 360 video doesn't have children, so just return null
  return null;
};
