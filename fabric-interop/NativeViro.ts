/**
 * NativeViro - JSI Bridge Functions
 *
 * This module provides direct JSI functions to communicate with the native Viro implementation.
 * These functions bypass the React Native bridge and codegen, providing direct access to
 * the existing native implementation.
 */

// Type definitions for props and events
export type ViroNodeProps = Record<string, any>;
export type ViroNodeType =
  | "box"
  | "sphere"
  | "text"
  | "image"
  | "animatedImage"
  | "animatedComponent"
  | "object"
  | "scene"
  | "arScene"
  | "camera"
  | "arCamera"
  | "orbitCamera"
  | "light"
  | "ambientLight"
  | "directionalLight"
  | "spotLight"
  | "omniLight"
  | "sound"
  | "soundField"
  | "spatialSound"
  | "video"
  | "materialVideo"
  | "portal"
  | "portalScene"
  | "plane"
  | "arPlane"
  | "arImageMarker"
  | "arObjectMarker"
  | "quad"
  | "polygon"
  | "polyline"
  | "geometry"
  | "particle"
  | "flexView"
  | "surface"
  | "360Image"
  | "360Video"
  | "skyBox"
  | "lightingEnvironment"
  | "button"
  | "controller"
  | "node";

export type ViroEventCallback = (event: any) => void;

// The global NativeViro object is injected by the native code
declare global {
  var NativeViro: {
    // Node management
    createViroNode: (
      nodeId: string,
      nodeType: ViroNodeType,
      props: ViroNodeProps
    ) => void;
    updateViroNode: (nodeId: string, props: ViroNodeProps) => void;
    deleteViroNode: (nodeId: string) => void;

    // Scene hierarchy
    addViroNodeChild: (parentId: string, childId: string) => void;
    removeViroNodeChild: (parentId: string, childId: string) => void;

    // Event handling
    registerEventCallback: (
      nodeId: string,
      eventName: string,
      callbackId: string
    ) => void;
    unregisterEventCallback: (
      nodeId: string,
      eventName: string,
      callbackId: string
    ) => void;

    // Materials
    createViroMaterial: (
      materialName: string,
      properties: Record<string, any>
    ) => void;
    updateViroMaterial: (
      materialName: string,
      properties: Record<string, any>
    ) => void;

    // Animations
    createViroAnimation: (
      animationName: string,
      properties: Record<string, any>
    ) => void;
    executeViroAnimation: (
      nodeId: string,
      animationName: string,
      options: Record<string, any>
    ) => void;

    // AR specific
    setViroARPlaneDetection: (config: {
      horizontal: boolean;
      vertical: boolean;
    }) => void;
    setViroARImageTargets: (targets: Record<string, any>) => void;

    // Initialization
    initialize: (apiKey: string) => Promise<boolean>;
  };
}

// Event callback registry
const eventCallbacks: Record<string, ViroEventCallback> = {};

// Generate a unique ID for nodes
let nextNodeId = 1;
export const generateNodeId = (): string => `viro_node_${nextNodeId++}`;

// Generate a unique ID for callbacks
let nextCallbackId = 1;
export const generateCallbackId = (): string =>
  `viro_callback_${nextCallbackId++}`;

// Event handler that receives events from native code
export function handleViroEvent(callbackId: string, event: any): void {
  const callback = eventCallbacks[callbackId];
  if (callback) {
    callback(event);
  }
}

// Register a JS callback for native events
export function registerEventListener(
  nodeId: string,
  eventName: string,
  callback: ViroEventCallback
): string {
  const callbackId = generateCallbackId();
  eventCallbacks[callbackId] = callback;

  // Register with native code
  if (global.NativeViro) {
    global.NativeViro.registerEventCallback(nodeId, eventName, callbackId);
  }

  return callbackId;
}

// Unregister a callback
export function unregisterEventListener(
  nodeId: string,
  eventName: string,
  callbackId: string
): void {
  delete eventCallbacks[callbackId];

  // Unregister with native code
  if (global.NativeViro) {
    global.NativeViro.unregisterEventCallback(nodeId, eventName, callbackId);
  }
}

// Initialize the Viro platform
export function initializeViro(apiKey: string): Promise<boolean> {
  if (global.NativeViro) {
    return global.NativeViro.initialize(apiKey);
  }
  return Promise.reject(new Error("NativeViro not available"));
}

// Check if the JSI interface is available
export function isViroJSIAvailable(): boolean {
  return !!global.NativeViro;
}
