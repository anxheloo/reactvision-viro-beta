/**
 * ViroOmniLight
 *
 * A component for adding omnidirectional lighting to a scene.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

export interface ViroOmniLightProps extends ViroCommonProps {
  // Light properties
  color?: string;
  intensity?: number;
  temperature?: number;
  position?: [number, number, number];
  influenceBitMask?: number;

  // Attenuation properties
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
 * ViroOmniLight is a component for adding omnidirectional lighting to a scene.
 * Omni light is a type of light that illuminates objects in the scene
 * from a specific position in all directions, like a light bulb.
 */
export const ViroOmniLight: React.FC<ViroOmniLightProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    color: props.color,
    intensity: props.intensity,
    temperature: props.temperature,
    position: props.position,
    influenceBitMask: props.influenceBitMask,
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
  const nodeId = useViroNode("omniLight", nativeProps, "viro_root_scene");

  // Omni light doesn't have children, so just return null
  return null;
};
