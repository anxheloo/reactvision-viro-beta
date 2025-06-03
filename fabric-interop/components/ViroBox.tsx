/**
 * ViroBox
 *
 * A 3D box component with customizable dimensions and materials.
 */

import React, { useContext } from "react";
import {
  ViroContext,
  ViroCommonProps,
  useViroNode,
  convertCommonProps,
} from "./ViroUtils";

export interface ViroBoxProps extends ViroCommonProps {
  // Box-specific props
  width?: number;
  height?: number;
  length?: number;
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;

  // Physics props
  highAccuracyEvents?: boolean;
}

/**
 * ViroBox is a 3D box component with customizable dimensions and materials.
 */
export const ViroBox: React.FC<ViroBoxProps> = (props) => {
  // Get the parent node ID from context
  const parentId = "viro_root_scene"; // Default to root scene

  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    width: props.width ?? 1,
    height: props.height ?? 1,
    length: props.length ?? 1,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
    highAccuracyEvents: props.highAccuracyEvents,
  };

  // Create the node
  const nodeId = useViroNode("box", nativeProps, parentId);

  // Box doesn't have children, so just return null
  return null;
};
