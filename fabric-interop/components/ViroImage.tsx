/**
 * ViroImage
 *
 * A component for displaying 2D images in 3D space.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroImageProps extends ViroCommonProps {
  // Image source
  source: { uri: string } | number;

  // Image properties
  width?: number;
  height?: number;
  resizeMode?: "ScaleToFill" | "ScaleToFit" | "StretchToFill";
  imageClipMode?: "None" | "ClipToBounds";
  stereoMode?: "LeftRight" | "RightLeft" | "TopBottom" | "BottomTop" | "None";
  format?: "RGBA8" | "RGB565";
  mipmap?: boolean;

  // Placeholder
  placeholderSource?: { uri: string } | number;

  // Materials
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;
}

/**
 * ViroImage is a component for displaying 2D images in 3D space.
 */
export const ViroImage: React.FC<ViroImageProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    source: props.source,
    width: props.width,
    height: props.height,
    resizeMode: props.resizeMode,
    imageClipMode: props.imageClipMode,
    stereoMode: props.stereoMode,
    format: props.format,
    mipmap: props.mipmap,
    placeholderSource: props.placeholderSource,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
  };

  // Create the node
  const nodeId = useViroNode("image", nativeProps, "viro_root_scene");

  // Image doesn't have children, so just return null
  return null;
};
