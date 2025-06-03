/**
 * ViroPolygon
 *
 * A component for rendering a 2D polygon in 3D space.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroPolygonProps extends ViroCommonProps {
  // Polygon vertices
  vertices: [number, number][];

  // Holes in the polygon
  holes?: [number, number][][];

  // Materials
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;
}

/**
 * ViroPolygon is a component for rendering a 2D polygon in 3D space.
 * It allows you to create complex 2D shapes by specifying a list of vertices.
 * You can also create holes in the polygon by specifying a list of hole vertices.
 */
export const ViroPolygon: React.FC<ViroPolygonProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    vertices: props.vertices,
    holes: props.holes,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
  };

  // Create the node
  const nodeId = useViroNode("polygon", nativeProps, "viro_root_scene");

  // Polygon doesn't have children, so just return null
  return null;
};
