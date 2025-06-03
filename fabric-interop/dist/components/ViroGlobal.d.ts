/**
 * ViroGlobal
 *
 * A utility to provide type-safe access to the global NativeViro object.
 */
declare global {
    var NativeViro: any;
}
export interface NativeViroType {
    createViroNode: (nodeId: string, nodeType: string, props: Record<string, any>) => void;
    updateViroNode: (nodeId: string, props: Record<string, any>) => void;
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
    recenterTracking: (nodeId: string) => void;
    project: (nodeId: string, point: [number, number, number]) => Promise<[number, number, number]>;
    unproject: (nodeId: string, point: [number, number, number]) => Promise<[number, number, number]>;
    initialize: (apiKey: string) => Promise<boolean>;
}
export declare function getNativeViro(): NativeViroType | null;
export declare function isNativeViroAvailable(): boolean;
//# sourceMappingURL=ViroGlobal.d.ts.map