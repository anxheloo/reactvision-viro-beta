/**
 * ViroSpotLight
 *
 * A component for adding spot lighting to a scene.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroSpotLightProps extends ViroCommonProps {
  // Light properties
  color?: string;
  intensity?: number;
  temperature?: number;
  direction?: [number, number, number];
  position?: [number, number, number];
  influenceBitMask?: number;

  // Spot light specific properties
  innerAngle?: number;
  outerAngle?: number;
  attenuationStartDistance?: number;
  attenuationEndDistance?: number;

  // Shadow properties
  castsShadow?: boolean;
  shadowOpacity?: number;
  shadowMapSize?: number;
  shadowBias?: number;
  shadowNearZ?: number;
  shadowFarZ?: number;
}

/**
 * ViroSpotLight is a component for adding spot lighting to a scene.
 * Spot light is a type of light that illuminates objects in the scene
 * from a specific position and in a specific direction, with a cone-shaped beam.
 */
export const ViroSpotLight: React.FC<ViroSpotLightProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    color: props.color,
    intensity: props.intensity,
    temperature: props.temperature,
    direction: props.direction,
    position: props.position,
    influenceBitMask: props.influenceBitMask,
    innerAngle: props.innerAngle,
    outerAngle: props.outerAngle,
    attenuationStartDistance: props.attenuationStartDistance,
    attenuationEndDistance: props.attenuationEndDistance,
    castsShadow: props.castsShadow,
    shadowOpacity: props.shadowOpacity,
    shadowMapSize: props.shadowMapSize,
    shadowBias: props.shadowBias,
    shadowNearZ: props.shadowNearZ,
    shadowFarZ: props.shadowFarZ,
  };

  // Create the node
  const nodeId = useViroNode("spotLight", nativeProps, "viro_root_scene");

  // Spot light doesn't have children, so just return null
  return null;
};
