"use strict";
/**
 * ViroVideo
 *
 * A component for displaying video content in 3D space.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroVideo = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroVideo is a component for displaying video content in 3D space.
 */
const ViroVideo = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        width: props.width,
        height: props.height,
        loop: props.loop,
        muted: props.muted,
        volume: props.volume,
        paused: props.paused,
        resizeMode: props.resizeMode,
        stereoMode: props.stereoMode,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
        onBufferStart: props.onBufferStart ? true : undefined,
        onBufferEnd: props.onBufferEnd ? true : undefined,
        onFinish: props.onFinish ? true : undefined,
        onUpdateTime: props.onUpdateTime ? true : undefined,
        onError: props.onError ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("video", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        const eventHandlers = [
            { name: "onBufferStart", handler: props.onBufferStart },
            { name: "onBufferEnd", handler: props.onBufferEnd },
            { name: "onFinish", handler: props.onFinish },
            { name: "onUpdateTime", handler: props.onUpdateTime },
            { name: "onError", handler: props.onError },
        ];
        // Register all event handlers
        const registeredCallbacks = eventHandlers
            .filter(({ handler }) => !!handler)
            .map(({ name, handler }) => {
            const callbackId = `${nodeId}_${name}`;
            nativeViro.registerEventCallback(nodeId, name, callbackId);
            return { name, callbackId };
        });
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            // Unregister all event handlers
            registeredCallbacks.forEach(({ name, callbackId }) => {
                nativeViro.unregisterEventCallback(nodeId, name, callbackId);
            });
        };
    }, [
        nodeId,
        props.onBufferStart,
        props.onBufferEnd,
        props.onFinish,
        props.onUpdateTime,
        props.onError,
    ]);
    // Video doesn't have children, so just return null
    return null;
};
exports.ViroVideo = ViroVideo;
