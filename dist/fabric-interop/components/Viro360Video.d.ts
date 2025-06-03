/**
 * Viro360Video
 *
 * A component for rendering 360-degree panoramic videos.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface Viro360VideoProps extends ViroCommonProps {
    source: {
        uri: string;
    } | number;
    loop?: boolean;
    muted?: boolean;
    volume?: number;
    paused?: boolean;
    stereoMode?: "LeftRight" | "RightLeft" | "TopBottom" | "BottomTop" | "None";
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: string) => void;
    onFinish?: () => void;
    onUpdateTime?: (currentTime: number, totalTime: number) => void;
    onBufferStart?: () => void;
    onBufferEnd?: () => void;
}
/**
 * Viro360Video is a component for rendering 360-degree panoramic videos.
 * It creates an immersive environment by wrapping a video around the user.
 */
export declare const Viro360Video: React.FC<Viro360VideoProps>;
