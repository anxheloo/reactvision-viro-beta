/**
 * ViroButton
 *
 * A component for creating interactive buttons in 3D space.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroButtonProps extends ViroCommonProps {
  // Button properties
  width?: number;
  height?: number;

  // Visual properties
  source?: { uri: string } | number;
  hoverSource?: { uri: string } | number;
  clickSource?: { uri: string } | number;

  // Material properties
  materials?: string | string[];
  hoverMaterials?: string | string[];
  clickMaterials?: string | string[];

  // State properties
  enabled?: boolean;

  // Events
  onHover?: (isHovering: boolean) => void;
  onClick?: () => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroButton is a component for creating interactive buttons in 3D space.
 * It supports different visual states for normal, hover, and click interactions.
 */
export const ViroButton: React.FC<ViroButtonProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    width: props.width,
    height: props.height,
    source: props.source,
    hoverSource: props.hoverSource,
    clickSource: props.clickSource,
    materials: props.materials,
    hoverMaterials: props.hoverMaterials,
    clickMaterials: props.clickMaterials,
    enabled: props.enabled,
    onHover: props.onHover ? true : undefined,
    onClick: props.onClick ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("button", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Register event handlers if provided
    if (props.onHover) {
      const callbackId = `${nodeId}_hover`;
      nativeViro.registerEventCallback(nodeId, "onHover", callbackId);
    }

    if (props.onClick) {
      const callbackId = `${nodeId}_click`;
      nativeViro.registerEventCallback(nodeId, "onClick", callbackId);
    }

    // Cleanup when unmounting
    return () => {
      const nativeViro = getNativeViro();
      if (!nativeViro) return;

      if (props.onHover) {
        const callbackId = `${nodeId}_hover`;
        nativeViro.unregisterEventCallback(nodeId, "onHover", callbackId);
      }

      if (props.onClick) {
        const callbackId = `${nodeId}_click`;
        nativeViro.unregisterEventCallback(nodeId, "onClick", callbackId);
      }
    };
  }, [nodeId, props.onHover, props.onClick]);

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
