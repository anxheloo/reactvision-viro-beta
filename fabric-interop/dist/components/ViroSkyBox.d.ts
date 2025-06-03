/**
 * ViroSkyBox
 *
 * A component for creating a skybox environment.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroSkyBoxProps extends ViroCommonProps {
    source?: {
        nx?: {
            uri: string;
        } | number;
        px?: {
            uri: string;
        } | number;
        ny?: {
            uri: string;
        } | number;
        py?: {
            uri: string;
        } | number;
        nz?: {
            uri: string;
        } | number;
        pz?: {
            uri: string;
        } | number;
    };
    source360?: {
        uri: string;
    } | number;
    format?: "RGBA8" | "RGB565";
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: string) => void;
}
/**
 * ViroSkyBox is a component for creating a skybox environment.
 * It creates a cube with textures on each face to simulate a distant environment.
 */
export declare const ViroSkyBox: React.FC<ViroSkyBoxProps>;
//# sourceMappingURL=ViroSkyBox.d.ts.map