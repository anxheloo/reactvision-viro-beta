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
export declare const generateNodeId: () => string;
export declare const generateCallbackId: () => string;
export declare function handleViroEvent(callbackId: string, event: any): void;
export declare function registerEventListener(nodeId: string, eventName: string, callback: ViroEventCallback): string;
export declare function unregisterEventListener(nodeId: string, eventName: string, callbackId: string): void;
export declare function initializeViro(apiKey: string): Promise<boolean>;
export declare function isViroJSIAvailable(): boolean;
//# sourceMappingURL=NativeViro.d.ts.map