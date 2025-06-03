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
// Register a JS callback for native events
function registerEventListener(nodeId, eventName, callback) {
    const callbackId = (0, exports.generateCallbackId)();
    eventCallbacks[callbackId] = callback;
    // Register with native code
    if (global.NativeViro) {
        global.NativeViro.registerEventCallback(nodeId, eventName, callbackId);
    }
    return callbackId;
}
// Unregister a callback
function unregisterEventListener(nodeId, eventName, callbackId) {
    delete eventCallbacks[callbackId];
    // Unregister with native code
    if (global.NativeViro) {
        global.NativeViro.unregisterEventCallback(nodeId, eventName, callbackId);
    }
}
// Initialize the Viro platform
function initializeViro(apiKey) {
    if (global.NativeViro) {
        return global.NativeViro.initialize(apiKey);
    }
    return Promise.reject(new Error("NativeViro not available"));
}
// Check if the JSI interface is available
function isViroJSIAvailable() {
    return !!global.NativeViro;
}
//# sourceMappingURL=NativeViro.js.map