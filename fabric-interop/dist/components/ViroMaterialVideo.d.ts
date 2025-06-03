/**
 * ViroMaterialVideo
 *
 * A component for applying video textures to materials.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroMaterialVideoProps extends ViroCommonProps {
    source: {
        uri: string;
    } | number;
    loop?: boolean;
    muted?: boolean;
    volume?: number;
    paused?: boolean;
    material?: string;
    onBufferStart?: () => void;
    onBufferEnd?: () => void;
    onFinish?: () => void;
    onUpdateTime?: (currentTime: number, totalTime: number) => void;
    onError?: (error: string) => void;
}
/**
 * ViroMaterialVideo is a component for applying video textures to materials.
 * It allows you to use videos as textures for 3D objects.
 */
export declare const ViroMaterialVideo: React.FC<ViroMaterialVideoProps>;
//# sourceMappingURL=ViroMaterialVideo.d.ts.map