/**
 * NativeViro - JSI Bridge Functions
 *
 * This module provides direct JSI functions to communicate with the native Viro implementation.
 * These functions bypass the React Native bridge and codegen, providing direct access to
 * the existing native implementation.
 */
export type ViroNodeProps = Record<string, any>;
export type ViroNodeType = "box" | "sphere" | "text" | "image" | "animatedImage" | "animatedComponent" | "object" | "scene" | "arScene" | "camera" | "arCamera" | "orbitCamera" | "light" | "ambientLight" | "directionalLight" | "spotLight" | "omniLight" | "sound" | "soundField" | "spatialSound" | "video" | "materialVideo" | "portal" | "portalScene" | "plane" | "arPlane" | "arImageMarker" | "arObjectMarker" | "quad" | "polygon" | "polyline" | "geometry" | "particle" | "flexView" | "surface" | "360Image" | "360Video" | "skyBox" | "lightingEnvironment" | "button" | "controller" | "node";
export type ViroEventCallback = (event: any) => void;
declare global {
    var NativeViro: {
        createViroNode: (nodeId: string, nodeType: ViroNodeType, props: ViroNodeProps) => void;
        updateViroNode: (nodeId: string, props: ViroNodeProps) => void;
        deleteViroNode: (nodeId: string) => void;
        addViroNodeChild: (parentId: string, childId: string) => void;
        removeViroNodeChild: (parentId: string, childId: string) => void;
        registerEventCallback: (nodeId: string, eventName: string, callbackId: string) => void;
        unregisterEventCallback: (nodeId: string, eventName: string, callbackId: string) => void;
        createViroMaterial: (materialName: string, properties: Record<string, any>) => void;
        updateViroMaterial: (materialName: string, properties: Record<string, any>) => void;
        createViroAnimation: (animationName: string, properties: Record<string, any>) => void;
        executeViroAnimation: (nodeId: string, animationName: string, options: Record<string, any>) => void;
        setViroARPlaneDetection: (config: {
            horizontal: boolean;
            vertical: boolean;
        }) => void;
        setViroARImageTargets: (targets: Record<string, any>) => void;
        initialize: (apiKey: string) => Promise<boolean>;
    };
}
export declare const generateNodeId: () => string;
export declare const generateCallbackId: () => string;
export declare function handleViroEvent(callbackId: string, event: any): void;
export declare function registerEventListener(nodeId: string, eventName: string, callback: ViroEventCallback): string;
export declare function unregisterEventListener(nodeId: string, eventName: string, callbackId: string): void;
export declare function initializeViro(apiKey: string): Promise<boolean>;
export declare function isViroJSIAvailable(): boolean;
//# sourceMappingURL=NativeViro.d.ts.map