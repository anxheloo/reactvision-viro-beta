"use strict";
/**
 * ViroSkyBox
 *
 * A component for creating a skybox environment.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroSkyBox = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroSkyBox is a component for creating a skybox environment.
 * It creates a cube with textures on each face to simulate a distant environment.
 */
const ViroSkyBox = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        source360: props.source360,
        format: props.format,
        onLoadStart: props.onLoadStart ? true : undefined,
        onLoadEnd: props.onLoadEnd ? true : undefined,
        onError: props.onError ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("skyBox", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        if (!global.NativeViro)
            return;
        // Register event handlers if provided
        if (props.onLoadStart) {
            const callbackId = `${nodeId}_load_start`;
            global.NativeViro.registerEventCallback(nodeId, "onLoadStart", callbackId);
        }
        if (props.onLoadEnd) {
            const callbackId = `${nodeId}_load_end`;
            global.NativeViro.registerEventCallback(nodeId, "onLoadEnd", callbackId);
        }
        if (props.onError) {
            const callbackId = `${nodeId}_error`;
            global.NativeViro.registerEventCallback(nodeId, "onError", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            if (!global.NativeViro)
                return;
            if (props.onLoadStart) {
                const callbackId = `${nodeId}_load_start`;
                global.NativeViro.unregisterEventCallback(nodeId, "onLoadStart", callbackId);
            }
            if (props.onLoadEnd) {
                const callbackId = `${nodeId}_load_end`;
                global.NativeViro.unregisterEventCallback(nodeId, "onLoadEnd", callbackId);
            }
            if (props.onError) {
                const callbackId = `${nodeId}_error`;
                global.NativeViro.unregisterEventCallback(nodeId, "onError", callbackId);
            }
        };
    }, [nodeId, props.onLoadStart, props.onLoadEnd, props.onError]);
    // Skybox doesn't have children, so just return null
    return null;
};
exports.ViroSkyBox = ViroSkyBox;
