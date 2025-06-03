/**
 * ViroController
 *
 * A component for handling VR controller input.
 */

import React from "react";
import {
  ViroCommonProps,
  useViroNode,
  convertCommonProps,
  ViroEventHandler,
} from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroControllerProps extends ViroCommonProps {
  // Controller properties
  hand?: "LEFT" | "RIGHT" | "NONE";

  // Visual properties
  visible?: boolean;

  // Additional events not in ViroCommonProps
  onControllerStatus?: ViroEventHandler;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroController is a component for handling VR controller input.
 * It represents a physical VR controller in the virtual environment.
 */
export const ViroController: React.FC<ViroControllerProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    hand: props.hand,
    visible: props.visible,
    onClick: props.onClick ? true : undefined,
    onDrag: props.onDrag ? true : undefined,
    onFuse: props.onFuse ? true : undefined,
    onPinch: props.onPinch ? true : undefined,
    onRotate: props.onRotate ? true : undefined,
    onControllerStatus: props.onControllerStatus ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("controller", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Register event handlers if provided
    if (props.onClick) {
      const callbackId = `${nodeId}_click`;
      nativeViro.registerEventCallback(nodeId, "onClick", callbackId);
    }

    if (props.onDrag) {
      const callbackId = `${nodeId}_drag`;
      nativeViro.registerEventCallback(nodeId, "onDrag", callbackId);
    }

    if (props.onFuse) {
      const callbackId = `${nodeId}_fuse`;
      nativeViro.registerEventCallback(nodeId, "onFuse", callbackId);
    }

    if (props.onPinch) {
      const callbackId = `${nodeId}_pinch`;
      nativeViro.registerEventCallback(nodeId, "onPinch", callbackId);
    }

    if (props.onRotate) {
      const callbackId = `${nodeId}_rotate`;
      nativeViro.registerEventCallback(nodeId, "onRotate", callbackId);
    }

    if (props.onControllerStatus) {
      const callbackId = `${nodeId}_controller_status`;
      nativeViro.registerEventCallback(
        nodeId,
        "onControllerStatus",
        callbackId
      );
    }

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro) return;

      if (props.onClick) {
        const callbackId = `${nodeId}_click`;
        nativeViro.unregisterEventCallback(nodeId, "onClick", callbackId);
      }

      if (props.onDrag) {
        const callbackId = `${nodeId}_drag`;
        nativeViro.unregisterEventCallback(nodeId, "onDrag", callbackId);
      }

      if (props.onFuse) {
        const callbackId = `${nodeId}_fuse`;
        nativeViro.unregisterEventCallback(nodeId, "onFuse", callbackId);
      }

      if (props.onPinch) {
        const callbackId = `${nodeId}_pinch`;
        nativeViro.unregisterEventCallback(nodeId, "onPinch", callbackId);
      }

      if (props.onRotate) {
        const callbackId = `${nodeId}_rotate`;
        nativeViro.unregisterEventCallback(nodeId, "onRotate", callbackId);
      }

      if (props.onControllerStatus) {
        const callbackId = `${nodeId}_controller_status`;
        nativeViro.unregisterEventCallback(
          nodeId,
          "onControllerStatus",
          callbackId
        );
      }
    };
  }, [
    nodeId,
    props.onClick,
    props.onDrag,
    props.onFuse,
    props.onPinch,
    props.onRotate,
    props.onControllerStatus,
  ]);

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
