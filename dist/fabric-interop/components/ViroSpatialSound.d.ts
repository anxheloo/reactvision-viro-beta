/**
 * ViroSpatialSound
 *
 * A component for creating spatial audio in 3D space.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroSpatialSoundProps extends ViroCommonProps {
    source: {
        uri: string;
    } | number;
    paused?: boolean;
    loop?: boolean;
    muted?: boolean;
    volume?: number;
    rolloffModel?: "None" | "Linear" | "Logarithmic" | "Exponential";
    minDistance?: number;
    maxDistance?: number;
    onFinish?: () => void;
    onError?: (error: string) => void;
}
/**
 * ViroSpatialSound is a component for creating spatial audio in 3D space.
 * It allows you to place sounds at specific positions in the 3D environment.
 */
export declare const ViroSpatialSound: React.FC<ViroSpatialSoundProps>;
