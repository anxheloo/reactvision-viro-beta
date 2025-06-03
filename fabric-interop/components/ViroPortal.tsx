/**
 * ViroPortal
 *
 * A component for creating portal entrances to other scenes.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroPortalProps extends ViroCommonProps {
  // Portal properties
  passable?: boolean;

  // Visual properties
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroPortal is a component for creating portal entrances to other scenes.
 * It acts as a doorway or window into another virtual environment.
 */
export const ViroPortal: React.FC<ViroPortalProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    passable: props.passable,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
  };

  // Create the node
  const nodeId = useViroNode("portal", nativeProps, "viro_root_scene");

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
