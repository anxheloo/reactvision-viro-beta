/**
 * ViroARPlane
 *
 * A component for rendering AR planes detected by the AR system.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroARPlaneProps extends ViroCommonProps {
  // Plane properties
  alignment?: "Horizontal" | "Vertical";
  minHeight?: number;
  minWidth?: number;

  // Visual properties
  visible?: boolean;
  opacity?: number;

  // Materials
  materials?: string | string[];

  // Events
  onAnchorFound?: () => void;
  onAnchorUpdated?: () => void;
  onAnchorRemoved?: () => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroARPlane is a component for rendering AR planes detected by the AR system.
 * It represents a real-world surface detected by the AR system, such as a floor, table, or wall.
 */
export const ViroARPlane: React.FC<ViroARPlaneProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    alignment: props.alignment,
    minHeight: props.minHeight,
    minWidth: props.minWidth,
    visible: props.visible,
    opacity: props.opacity,
    materials: props.materials,
    onAnchorFound: props.onAnchorFound ? true : undefined,
    onAnchorUpdated: props.onAnchorUpdated ? true : undefined,
    onAnchorRemoved: props.onAnchorRemoved ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("arPlane", nativeProps, "viro_root_scene");

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
