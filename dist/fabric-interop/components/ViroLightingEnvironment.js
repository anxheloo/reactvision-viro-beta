"use strict";
/**
 * ViroLightingEnvironment
 *
 * A component for creating realistic lighting environments.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroLightingEnvironment = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroLightingEnvironment is a component for creating realistic lighting environments.
 * It uses an environment map to provide realistic reflections and lighting for PBR materials.
 */
const ViroLightingEnvironment = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        influenceBitMask: props.influenceBitMask,
        intensity: props.intensity,
        onLoadStart: props.onLoadStart ? true : undefined,
        onLoadEnd: props.onLoadEnd ? true : undefined,
        onError: props.onError ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("lightingEnvironment", nativeProps, "viro_root_scene");
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
    // Lighting environment doesn't have children, so just return null
    return null;
};
exports.ViroLightingEnvironment = ViroLightingEnvironment;
