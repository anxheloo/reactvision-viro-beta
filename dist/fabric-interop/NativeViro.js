"use strict";
/**
 * NativeViro - JSI Bridge Functions
 *
 * This module provides direct JSI functions to communicate with the native Viro implementation.
 * These functions bypass the React Native bridge and codegen, providing direct access to
 * the existing native implementation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCallbackId = exports.generateNodeId = void 0;
exports.handleViroEvent = handleViroEvent;
exports.registerEventListener = registerEventListener;
exports.unregisterEventListener = unregisterEventListener;
exports.initializeViro = initializeViro;
exports.isViroJSIAvailable = isViroJSIAvailable;
// The global NativeViro object is injected by the native code
// Note: The type declaration is in the generated .d.ts file
// We don't redeclare it here to avoid conflicts
// Additional methods that may not be in the type declaration
// These are accessed using type assertions in the components
// - recenterTracking(nodeId: string): void
// - project(nodeId: string, point: [number, number, number]): Promise<[number, number, number]>
// - unproject(nodeId: string, point: [number, number, number]): Promise<[number, number, number]>
// Event callback registry
const eventCallbacks = {};
// Generate a unique ID for nodes
let nextNodeId = 1;
const generateNodeId = () => `viro_node_${nextNodeId++}`;
exports.generateNodeId = generateNodeId;
// Generate a unique ID for callbacks
let nextCallbackId = 1;
const generateCallbackId = () => `viro_callback_${nextCallbackId++}`;
exports.generateCallbackId = generateCallbackId;
// Event handler that receives events from native code
function handleViroEvent(callbackId, event) {
    const callback = eventCallbacks[callbackId];
    if (callback) {
        callback(event);
    }
}
const ViroGlobal_1 = require("./components/ViroGlobal");
// Register a JS callback for native events
function registerEventListener(nodeId, eventName, callback) {
    const callbackId = (0, exports.generateCallbackId)();
    eventCallbacks[callbackId] = callback;
    // Register with native code
    const nativeViro = (0, ViroGlobal_1.getNativeViro)();
    if (nativeViro) {
        nativeViro.registerEventCallback(nodeId, eventName, callbackId);
    }
    return callbackId;
}
// Unregister a callback
function unregisterEventListener(nodeId, eventName, callbackId) {
    delete eventCallbacks[callbackId];
    // Unregister with native code
    const nativeViro = (0, ViroGlobal_1.getNativeViro)();
    if (nativeViro) {
        nativeViro.unregisterEventCallback(nodeId, eventName, callbackId);
    }
}
// Initialize the Viro platform
function initializeViro(apiKey) {
    const nativeViro = (0, ViroGlobal_1.getNativeViro)();
    if (nativeViro) {
        return nativeViro.initialize(apiKey);
    }
    return Promise.reject(new Error("NativeViro not available"));
}
// Check if the JSI interface is available
function isViroJSIAvailable() {
    return (0, ViroGlobal_1.isNativeViroAvailable)();
}
