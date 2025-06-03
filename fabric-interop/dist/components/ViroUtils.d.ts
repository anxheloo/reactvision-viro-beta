/**
 * ViroUtils
 *
 * Common utility functions and hooks for Viro components.
 */
import { ViroNodeProps, ViroNodeType } from "../NativeViro";
export declare function useViroNode(nodeType: ViroNodeType, props: ViroNodeProps, parentId?: string): string;
export declare function useViroChildren(nodeId: string, children: React.ReactNode): React.ReactNode;
export type ViroEventHandler = (event: any) => void;
export type ViroPosition = [number, number, number];
export type ViroRotation = [number, number, number];
export type ViroScale = [number, number, number] | number;
export interface ViroCommonProps {
    position?: ViroPosition;
    rotation?: ViroRotation;
    scale?: ViroScale;
    transformBehaviors?: string[];
    opacity?: number;
    visible?: boolean;
    animation?: {
        name?: string;
        delay?: number;
        loop?: boolean;
        onStart?: () => void;
        onFinish?: () => void;
        run?: boolean;
        interruptible?: boolean;
    };
    onHover?: ViroEventHandler;
    onClick?: ViroEventHandler;
    onClickState?: ViroEventHandler;
    onTouch?: ViroEventHandler;
    onScroll?: ViroEventHandler;
    onSwipe?: ViroEventHandler;
    onDrag?: ViroEventHandler;
    onPinch?: ViroEventHandler;
    onRotate?: ViroEventHandler;
    onFuse?: ViroEventHandler | {
        callback: ViroEventHandler;
        timeToFuse?: number;
    };
    onCollision?: ViroEventHandler;
    onTransformUpdate?: ViroEventHandler;
}
export declare function convertCommonProps(props: ViroCommonProps): ViroNodeProps;
export declare const ViroContext: {
    Provider: ({ value, children, }: {
        value: string;
        children: React.ReactNode;
    }) => import("react").ReactNode;
    Consumer: ({ children, }: {
        children: (parentId: string) => React.ReactNode;
    }) => import("react").ReactNode;
};
//# sourceMappingURL=ViroUtils.d.ts.map