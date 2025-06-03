/**
 * ViroCamera
 *
 * A component for controlling the camera in a scene.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export type ViroCameraTransformUpdateEvent = {
    position: [number, number, number];
    rotation: [number, number, number];
};
export interface ViroCameraProps extends Omit<ViroCommonProps, "onTransformUpdate"> {
    position?: [number, number, number];
    rotation?: [number, number, number];
    active?: boolean;
    fieldOfView?: number;
    animation?: {
        name?: string;
        delay?: number;
        loop?: boolean;
        onStart?: () => void;
        onFinish?: () => void;
        run?: boolean;
        interruptible?: boolean;
    };
    onTransformUpdate?: (event: ViroCameraTransformUpdateEvent) => void;
    children?: React.ReactNode;
}
/**
 * ViroCamera is a component for controlling the camera in a scene.
 * It defines the viewpoint from which the scene is rendered.
 */
export declare const ViroCamera: React.FC<ViroCameraProps>;
