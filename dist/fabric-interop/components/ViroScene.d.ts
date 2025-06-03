/**
 * ViroScene
 *
 * A container for 3D content in the Viro scene graph.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroSceneProps extends ViroCommonProps {
    displayPointCloud?: boolean;
    pointCloudColor?: string;
    pointCloudSize?: number;
    lightReceivingBitMask?: number;
    shadowCastingBitMask?: number;
    physicsWorld?: {
        gravity?: [number, number, number];
    };
    postProcessEffects?: string[];
    onPlatformUpdate?: (event: any) => void;
    onCameraTransformUpdate?: (event: any) => void;
    onAmbientLightUpdate?: (event: any) => void;
    children?: React.ReactNode;
}
/**
 * ViroScene is a container for 3D content in the Viro scene graph.
 */
export declare const ViroScene: React.FC<ViroSceneProps>;
