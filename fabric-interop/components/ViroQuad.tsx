/**
 * ViroQuad
 *
 * A component for rendering a 2D quad in 3D space.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroQuadProps extends ViroCommonProps {
  // Quad properties
  width?: number;
  height?: number;

  // UV coordinates
  uvCoordinates?: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ];

  // Materials
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;

  // Physics props
  arShadowReceiver?: boolean;
}

/**
 * ViroQuad is a component for rendering a 2D quad in 3D space.
 * It's a flat rectangular surface that can be used for various purposes,
 * such as displaying images, videos, or creating simple geometric shapes.
 */
export const ViroQuad: React.FC<ViroQuadProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    width: props.width ?? 1,
    height: props.height ?? 1,
    uvCoordinates: props.uvCoordinates,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
    arShadowReceiver: props.arShadowReceiver,
  };

  // Create the node
  const nodeId = useViroNode("quad", nativeProps, "viro_root_scene");

  // Quad doesn't have children, so just return null
  return null;
};
