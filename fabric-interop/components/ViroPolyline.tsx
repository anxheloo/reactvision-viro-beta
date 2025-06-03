/**
 * ViroPolyline
 *
 * A component for rendering a 3D polyline.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroPolylineProps extends ViroCommonProps {
  // Polyline points
  points: [number, number, number][];

  // Polyline properties
  thickness?: number;

  // Materials
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;
}

/**
 * ViroPolyline is a component for rendering a 3D polyline.
 * It allows you to create a line that connects a series of points in 3D space.
 */
export const ViroPolyline: React.FC<ViroPolylineProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    points: props.points,
    thickness: props.thickness ?? 0.1,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
  };

  // Create the node
  const nodeId = useViroNode("polyline", nativeProps, "viro_root_scene");

  // Polyline doesn't have children, so just return null
  return null;
};
