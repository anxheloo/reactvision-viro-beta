/**
 * ViroSphere
 *
 * A 3D sphere component with customizable radius and materials.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroSphereProps extends ViroCommonProps {
  // Sphere-specific props
  radius?: number;
  facesCount?: number;
  segmentCount?: number;
  widthSegmentCount?: number;
  heightSegmentCount?: number;
  materials?: string | string[];

  // Lighting props
  lightReceivingBitMask?: number;
  shadowCastingBitMask?: number;

  // Physics props
  highAccuracyEvents?: boolean;
}

/**
 * ViroSphere is a 3D sphere component with customizable radius and materials.
 */
export const ViroSphere: React.FC<ViroSphereProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    radius: props.radius ?? 1,
    facesCount: props.facesCount,
    segmentCount: props.segmentCount,
    widthSegmentCount: props.widthSegmentCount,
    heightSegmentCount: props.heightSegmentCount,
    materials: props.materials,
    lightReceivingBitMask: props.lightReceivingBitMask,
    shadowCastingBitMask: props.shadowCastingBitMask,
    highAccuracyEvents: props.highAccuracyEvents,
  };

  // Create the node
  const nodeId = useViroNode("sphere", nativeProps, "viro_root_scene");

  // Sphere doesn't have children, so just return null
  return null;
};
