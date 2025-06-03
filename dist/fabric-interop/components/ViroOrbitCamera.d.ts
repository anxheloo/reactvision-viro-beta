/**
 * ViroOrbitCamera
 *
 * A specialized camera that orbits around a target point.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export type ViroOrbitCameraTransformUpdateEvent = {
    position: [number, number, number];
    rotation: [number, number, number];
};
export interface ViroOrbitCameraProps extends Omit<ViroCommonProps, "onTransformUpdate"> {
    position?: [number, number, number];
    active?: boolean;
    fieldOfView?: number;
    focalPoint?: [number, number, number];
    focalDistance?: number;
    enableZoom?: boolean;
    enablePan?: boolean;
    enableRotate?: boolean;
    enableFling?: boolean;
    minZoom?: number;
    maxZoom?: number;
    minPan?: [number, number, number];
    maxPan?: [number, number, number];
    minRotation?: [number, number, number];
    maxRotation?: [number, number, number];
    animation?: {
        name?: string;
        delay?: number;
        loop?: boolean;
        onStart?: () => void;
        onFinish?: () => void;
        run?: boolean;
        interruptible?: boolean;
    };
    onTransformUpdate?: (event: ViroOrbitCameraTransformUpdateEvent) => void;
    children?: React.ReactNode;
}
/**
 * ViroOrbitCamera is a specialized camera that orbits around a target point.
 * It provides controls for zooming, panning, and rotating around the focal point.
 */
export declare const ViroOrbitCamera: React.FC<ViroOrbitCameraProps>;
