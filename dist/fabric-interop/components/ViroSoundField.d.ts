/**
 * ViroSoundField
 *
 * A component for playing ambient audio that doesn't have a specific position in 3D space.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroSoundFieldProps extends ViroCommonProps {
    source: {
        uri: string;
    } | number;
    paused?: boolean;
    loop?: boolean;
    muted?: boolean;
    volume?: number;
    onFinish?: () => void;
    onError?: (error: string) => void;
}
/**
 * ViroSoundField is a component for playing ambient audio that doesn't have a specific position in 3D space.
 * Unlike ViroSound, ViroSoundField plays audio that is not affected by the listener's position or orientation.
 * It's ideal for background music, ambient sounds, or narration.
 */
export declare const ViroSoundField: React.FC<ViroSoundFieldProps>;
