/**
 * ViroAnimatedComponent
 *
 * A component for creating animated components.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroAnimatedComponentProps extends ViroCommonProps {
    animation?: {
        name?: string;
        delay?: number;
        loop?: boolean;
        onStart?: () => void;
        onFinish?: () => void;
        run?: boolean;
        interruptible?: boolean;
    };
    children?: React.ReactNode;
}
/**
 * ViroAnimatedComponent is a component for creating animated components.
 * It allows you to apply animations to any Viro component.
 */
export declare const ViroAnimatedComponent: React.FC<ViroAnimatedComponentProps>;
//# sourceMappingURL=ViroAnimatedComponent.d.ts.map