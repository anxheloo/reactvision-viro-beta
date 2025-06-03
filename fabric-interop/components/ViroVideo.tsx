/**
 * ViroVideo
 *
 * A component for displaying video content in 3D space.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroVideoProps extends ViroCommonProps {
  // Video source
  source: { uri: string } | number;

  // Video properties
  width?: number;
  height?: number;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  paused?: boolean;
  resizeMode?: "ScaleToFill" | "ScaleToFit" | "StretchToFill";
  stereoMode?: "LeftRight" | "RightLeft" | "TopBottom" | "BottomTop" | "None";

  // Materials
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;

  // Events
  onBufferStart?: () => void;
  onBufferEnd?: () => void;
  onFinish?: () => void;
  onUpdateTime?: (currentTime: number, totalTime: number) => void;
  onError?: (error: string) => void;
}

/**
 * ViroVideo is a component for displaying video content in 3D space.
 */
export const ViroVideo: React.FC<ViroVideoProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    width: props.width,
    height: props.height,
    loop: props.loop,
    muted: props.muted,
    volume: props.volume,
    paused: props.paused,
    resizeMode: props.resizeMode,
    stereoMode: props.stereoMode,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
    onBufferStart: props.onBufferStart ? true : undefined,
    onBufferEnd: props.onBufferEnd ? true : undefined,
    onFinish: props.onFinish ? true : undefined,
    onUpdateTime: props.onUpdateTime ? true : undefined,
    onError: props.onError ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("video", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Register event handlers if provided
    const eventHandlers = [
      { name: "onBufferStart", handler: props.onBufferStart },
      { name: "onBufferEnd", handler: props.onBufferEnd },
      { name: "onFinish", handler: props.onFinish },
      { name: "onUpdateTime", handler: props.onUpdateTime },
      { name: "onError", handler: props.onError },
    ];

    // Register all event handlers
    const registeredCallbacks = eventHandlers
      .filter(({ handler }) => !!handler)
      .map(({ name, handler }) => {
        const callbackId = `${nodeId}_${name}`;
        nativeViro.registerEventCallback(nodeId, name, callbackId);
        return { name, callbackId };
      });

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro) return;

      // Unregister all event handlers
      registeredCallbacks.forEach(({ name, callbackId }) => {
        nativeViro.unregisterEventCallback(nodeId, name, callbackId);
      });
    };
  }, [
    nodeId,
    props.onBufferStart,
    props.onBufferEnd,
    props.onFinish,
    props.onUpdateTime,
    props.onError,
  ]);

  // Video doesn't have children, so just return null
  return null;
};
