/**
 * Viro360Image
 *
 * A component for rendering 360-degree panoramic images.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface Viro360ImageProps extends ViroCommonProps {
    source: {
        uri: string;
    } | number;
    format?: "RGBA8" | "RGB565";
    stereoMode?: "LeftRight" | "RightLeft" | "TopBottom" | "BottomTop" | "None";
    rotation?: [number, number, number];
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: string) => void;
}
/**
 * Viro360Image is a component for rendering 360-degree panoramic images.
 * It creates an immersive environment by wrapping an image around the user.
 */
export declare const Viro360Image: React.FC<Viro360ImageProps>;
//# sourceMappingURL=Viro360Image.d.ts.map