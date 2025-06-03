"use strict";
/**
 * ViroMaterialVideo
 *
 * A component for applying video textures to materials.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroMaterialVideo = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroMaterialVideo is a component for applying video textures to materials.
 * It allows you to use videos as textures for 3D objects.
 */
const ViroMaterialVideo = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        loop: props.loop,
        muted: props.muted,
        volume: props.volume,
        paused: props.paused,
        material: props.material,
        onBufferStart: props.onBufferStart ? true : undefined,
        onBufferEnd: props.onBufferEnd ? true : undefined,
        onFinish: props.onFinish ? true : undefined,
        onUpdateTime: props.onUpdateTime ? true : undefined,
        onError: props.onError ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("materialVideo", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onBufferStart) {
            const callbackId = `${nodeId}_buffer_start`;
            nativeViro.registerEventCallback(nodeId, "onBufferStart", callbackId);
        }
        if (props.onBufferEnd) {
            const callbackId = `${nodeId}_buffer_end`;
            nativeViro.registerEventCallback(nodeId, "onBufferEnd", callbackId);
        }
        if (props.onFinish) {
            const callbackId = `${nodeId}_finish`;
            nativeViro.registerEventCallback(nodeId, "onFinish", callbackId);
        }
        if (props.onUpdateTime) {
            const callbackId = `${nodeId}_update_time`;
            nativeViro.registerEventCallback(nodeId, "onUpdateTime", callbackId);
        }
        if (props.onError) {
            const callbackId = `${nodeId}_error`;
            nativeViro.registerEventCallback(nodeId, "onError", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onBufferStart) {
                const callbackId = `${nodeId}_buffer_start`;
                nativeViro.unregisterEventCallback(nodeId, "onBufferStart", callbackId);
            }
            if (props.onBufferEnd) {
                const callbackId = `${nodeId}_buffer_end`;
                nativeViro.unregisterEventCallback(nodeId, "onBufferEnd", callbackId);
            }
            if (props.onFinish) {
                const callbackId = `${nodeId}_finish`;
                nativeViro.unregisterEventCallback(nodeId, "onFinish", callbackId);
            }
            if (props.onUpdateTime) {
                const callbackId = `${nodeId}_update_time`;
                nativeViro.unregisterEventCallback(nodeId, "onUpdateTime", callbackId);
            }
            if (props.onError) {
                const callbackId = `${nodeId}_error`;
                nativeViro.unregisterEventCallback(nodeId, "onError", callbackId);
            }
        };
    }, [
        nodeId,
        props.onBufferStart,
        props.onBufferEnd,
        props.onFinish,
        props.onUpdateTime,
        props.onError,
    ]);
    // Material video doesn't have children, so just return null
    return null;
};
exports.ViroMaterialVideo = ViroMaterialVideo;
