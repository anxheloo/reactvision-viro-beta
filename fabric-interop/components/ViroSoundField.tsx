/**
 * ViroSoundField
 *
 * A component for playing ambient audio that doesn't have a specific position in 3D space.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroSoundFieldProps extends ViroCommonProps {
  // Sound source
  source: { uri: string } | number;

  // Sound properties
  paused?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;

  // Events
  onFinish?: () => void;
  onError?: (error: string) => void;
}

/**
 * ViroSoundField is a component for playing ambient audio that doesn't have a specific position in 3D space.
 * Unlike ViroSound, ViroSoundField plays audio that is not affected by the listener's position or orientation.
 * It's ideal for background music, ambient sounds, or narration.
 */
export const ViroSoundField: React.FC<ViroSoundFieldProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    paused: props.paused,
    loop: props.loop,
    muted: props.muted,
    volume: props.volume,
    onFinish: props.onFinish ? true : undefined,
    onError: props.onError ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("soundField", nativeProps, "viro_root_scene");

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

  // SoundField doesn't have children, so just return null
  return null;
};
