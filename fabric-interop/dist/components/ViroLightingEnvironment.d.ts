/**
 * ViroLightingEnvironment
 *
 * A component for creating realistic lighting environments.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroLightingEnvironmentProps extends ViroCommonProps {
    source: {
        uri: string;
    } | number;
    influenceBitMask?: number;
    intensity?: number;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: string) => void;
}
/**
 * ViroLightingEnvironment is a component for creating realistic lighting environments.
 * It uses an environment map to provide realistic reflections and lighting for PBR materials.
 */
export declare const ViroLightingEnvironment: React.FC<ViroLightingEnvironmentProps>;
//# sourceMappingURL=ViroLightingEnvironment.d.ts.map