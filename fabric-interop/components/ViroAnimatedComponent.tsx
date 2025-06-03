/**
 * ViroAnimatedComponent
 *
 * A component for creating animated components.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroAnimatedComponentProps extends ViroCommonProps {
  // Animation properties
  animation?: {
    name?: string;
    delay?: number;
    loop?: boolean;
    onStart?: () => void;
    onFinish?: () => void;
    run?: boolean;
    interruptible?: boolean;
  };

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroAnimatedComponent is a component for creating animated components.
 * It allows you to apply animations to any Viro component.
 */
export const ViroAnimatedComponent: React.FC<ViroAnimatedComponentProps> = (
  props
) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    animation: props.animation,
  };

  // Create the node
  const nodeId = useViroNode(
    "animatedComponent",
    nativeProps,
    "viro_root_scene"
  );

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro || !props.animation) return;

    // Register event handlers if provided
    if (props.animation.onStart) {
      const callbackId = `${nodeId}_animation_start`;
      nativeViro.registerEventCallback(nodeId, "onAnimationStart", callbackId);
    }

    if (props.animation.onFinish) {
      const callbackId = `${nodeId}_animation_finish`;
      nativeViro.registerEventCallback(nodeId, "onAnimationFinish", callbackId);
    }

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro || !props.animation) return;

      if (props.animation.onStart) {
        const callbackId = `${nodeId}_animation_start`;
        nativeViro.unregisterEventCallback(
          nodeId,
          "onAnimationStart",
          callbackId
        );
      }

      if (props.animation.onFinish) {
        const callbackId = `${nodeId}_animation_finish`;
        nativeViro.unregisterEventCallback(
          nodeId,
          "onAnimationFinish",
          callbackId
        );
      }
    };
  }, [nodeId, props.animation]);

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
