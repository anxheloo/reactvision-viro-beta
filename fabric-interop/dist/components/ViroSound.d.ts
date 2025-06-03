/**
 * ViroSound
 *
 * A component for playing audio in 3D space.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroSoundProps extends ViroCommonProps {
    source: {
        uri: string;
    } | number;
    paused?: boolean;
    loop?: boolean;
    muted?: boolean;
    volume?: number;
    rolloffModel?: "None" | "Linear" | "Logarithmic";
    minDistance?: number;
    maxDistance?: number;
    onFinish?: () => void;
    onError?: (error: string) => void;
}
/**
 * ViroSound is a component for playing audio in 3D space.
 * It allows you to play audio files with 3D spatial effects,
 * where the sound's volume and direction change based on the listener's position.
 */
export declare const ViroSound: React.FC<ViroSoundProps>;
//# sourceMappingURL=ViroSound.d.ts.map