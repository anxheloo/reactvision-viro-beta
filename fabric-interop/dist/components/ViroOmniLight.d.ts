/**
 * ViroOmniLight
 *
 * A component for adding omnidirectional lighting to a scene.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroOmniLightProps extends ViroCommonProps {
    color?: string;
    intensity?: number;
    temperature?: number;
    position?: [number, number, number];
    influenceBitMask?: number;
    attenuationStartDistance?: number;
    attenuationEndDistance?: number;
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
export declare const ViroOmniLight: React.FC<ViroOmniLightProps>;
//# sourceMappingURL=ViroOmniLight.d.ts.map