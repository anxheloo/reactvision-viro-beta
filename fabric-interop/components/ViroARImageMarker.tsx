/**
 * ViroARImageMarker
 *
 * A component for detecting and tracking images in the real world.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroARImageMarkerProps extends ViroCommonProps {
  // Image marker properties
  target: string;

  // Visual properties
  visible?: boolean;
  opacity?: number;

  // Events
  onAnchorFound?: () => void;
  onAnchorUpdated?: () => void;
  onAnchorRemoved?: () => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroARImageMarker is a component for detecting and tracking images in the real world.
 * It allows you to attach virtual content to real-world images, such as posters, book covers, or logos.
 */
export const ViroARImageMarker: React.FC<ViroARImageMarkerProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    target: props.target,
    visible: props.visible,
    opacity: props.opacity,
    onAnchorFound: props.onAnchorFound ? true : undefined,
    onAnchorUpdated: props.onAnchorUpdated ? true : undefined,
    onAnchorRemoved: props.onAnchorRemoved ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("arImageMarker", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Register event handlers if provided
    if (props.onAnchorFound) {
      const callbackId = `${nodeId}_anchor_found`;
      nativeViro.registerEventCallback(nodeId, "onAnchorFound", callbackId);
    }

    if (props.onAnchorUpdated) {
      const callbackId = `${nodeId}_anchor_updated`;
      nativeViro.registerEventCallback(nodeId, "onAnchorUpdated", callbackId);
    }

    if (props.onAnchorRemoved) {
      const callbackId = `${nodeId}_anchor_removed`;
      nativeViro.registerEventCallback(nodeId, "onAnchorRemoved", callbackId);
    }

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro) return;

      if (props.onAnchorFound) {
        const callbackId = `${nodeId}_anchor_found`;
        nativeViro.unregisterEventCallback(nodeId, "onAnchorFound", callbackId);
      }

      if (props.onAnchorUpdated) {
        const callbackId = `${nodeId}_anchor_updated`;
        nativeViro.unregisterEventCallback(
          nodeId,
          "onAnchorUpdated",
          callbackId
        );
      }

      if (props.onAnchorRemoved) {
        const callbackId = `${nodeId}_anchor_removed`;
        nativeViro.unregisterEventCallback(
          nodeId,
          "onAnchorRemoved",
          callbackId
        );
      }
    };
  }, [
    nodeId,
    props.onAnchorFound,
    props.onAnchorUpdated,
    props.onAnchorRemoved,
  ]);

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
