"use strict";
/**
 * Viro3DObject
 *
 * A component for loading and displaying 3D models in various formats.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viro3DObject = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * Viro3DObject is a component for loading and displaying 3D models in various formats.
 */
const Viro3DObject = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        resources: props.resources,
        type: props.type,
        materials: props.materials,
        morphTargets: props.morphTargets,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
        highAccuracyEvents: props.highAccuracyEvents,
        physicsBody: props.physicsBody,
        onLoadStart: props.onLoadStart ? true : undefined,
        onLoadEnd: props.onLoadEnd ? true : undefined,
        onError: props.onError ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("object", nativeProps, "viro_root_scene");
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
    // 3D Object doesn't have children, so just return null
    return null;
};
exports.Viro3DObject = Viro3DObject;
//# sourceMappingURL=Viro3DObject.js.map