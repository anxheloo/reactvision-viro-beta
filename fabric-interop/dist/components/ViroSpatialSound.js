"use strict";
/**
 * ViroSpatialSound
 *
 * A component for creating spatial audio in 3D space.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroSpatialSound = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroSpatialSound is a component for creating spatial audio in 3D space.
 * It allows you to place sounds at specific positions in the 3D environment.
 */
const ViroSpatialSound = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        paused: props.paused,
        loop: props.loop,
        muted: props.muted,
        volume: props.volume,
        rolloffModel: props.rolloffModel,
        minDistance: props.minDistance,
        maxDistance: props.maxDistance,
        onFinish: props.onFinish ? true : undefined,
        onError: props.onError ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("spatialSound", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        if (!global.NativeViro)
            return;
        // Register event handlers if provided
        if (props.onFinish) {
            const callbackId = `${nodeId}_finish`;
            global.NativeViro.registerEventCallback(nodeId, "onFinish", callbackId);
        }
        if (props.onError) {
            const callbackId = `${nodeId}_error`;
            global.NativeViro.registerEventCallback(nodeId, "onError", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            if (!global.NativeViro)
                return;
            if (props.onFinish) {
                const callbackId = `${nodeId}_finish`;
                global.NativeViro.unregisterEventCallback(nodeId, "onFinish", callbackId);
            }
            if (props.onError) {
                const callbackId = `${nodeId}_error`;
                global.NativeViro.unregisterEventCallback(nodeId, "onError", callbackId);
            }
        };
    }, [nodeId, props.onFinish, props.onError]);
    // Spatial sound doesn't have children, so just return null
    return null;
};
exports.ViroSpatialSound = ViroSpatialSound;
//# sourceMappingURL=ViroSpatialSound.js.map