"use strict";
/**
 * Viro360Video
 *
 * A component for rendering 360-degree panoramic videos.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viro360Video = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * Viro360Video is a component for rendering 360-degree panoramic videos.
 * It creates an immersive environment by wrapping a video around the user.
 */
const Viro360Video = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        loop: props.loop,
        muted: props.muted,
        volume: props.volume,
        paused: props.paused,
        stereoMode: props.stereoMode,
        onLoadStart: props.onLoadStart ? true : undefined,
        onLoadEnd: props.onLoadEnd ? true : undefined,
        onError: props.onError ? true : undefined,
        onFinish: props.onFinish ? true : undefined,
        onUpdateTime: props.onUpdateTime ? true : undefined,
        onBufferStart: props.onBufferStart ? true : undefined,
        onBufferEnd: props.onBufferEnd ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("360Video", nativeProps, "viro_root_scene");
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
        if (props.onFinish) {
            const callbackId = `${nodeId}_finish`;
            global.NativeViro.registerEventCallback(nodeId, "onFinish", callbackId);
        }
        if (props.onUpdateTime) {
            const callbackId = `${nodeId}_update_time`;
            global.NativeViro.registerEventCallback(nodeId, "onUpdateTime", callbackId);
        }
        if (props.onBufferStart) {
            const callbackId = `${nodeId}_buffer_start`;
            global.NativeViro.registerEventCallback(nodeId, "onBufferStart", callbackId);
        }
        if (props.onBufferEnd) {
            const callbackId = `${nodeId}_buffer_end`;
            global.NativeViro.registerEventCallback(nodeId, "onBufferEnd", callbackId);
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
            if (props.onFinish) {
                const callbackId = `${nodeId}_finish`;
                global.NativeViro.unregisterEventCallback(nodeId, "onFinish", callbackId);
            }
            if (props.onUpdateTime) {
                const callbackId = `${nodeId}_update_time`;
                global.NativeViro.unregisterEventCallback(nodeId, "onUpdateTime", callbackId);
            }
            if (props.onBufferStart) {
                const callbackId = `${nodeId}_buffer_start`;
                global.NativeViro.unregisterEventCallback(nodeId, "onBufferStart", callbackId);
            }
            if (props.onBufferEnd) {
                const callbackId = `${nodeId}_buffer_end`;
                global.NativeViro.unregisterEventCallback(nodeId, "onBufferEnd", callbackId);
            }
        };
    }, [
        nodeId,
        props.onLoadStart,
        props.onLoadEnd,
        props.onError,
        props.onFinish,
        props.onUpdateTime,
        props.onBufferStart,
        props.onBufferEnd,
    ]);
    // 360 video doesn't have children, so just return null
    return null;
};
exports.Viro360Video = Viro360Video;
