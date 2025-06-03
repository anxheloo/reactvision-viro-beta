"use strict";
/**
 * ViroAnimatedImage
 *
 * A component for displaying animated images.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroAnimatedImage = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroAnimatedImage is a component for displaying animated images.
 * It can be used to create simple animations by cycling through a series of images.
 */
const ViroAnimatedImage = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        loop: props.loop,
        delay: props.delay,
        visible: props.visible,
        opacity: props.opacity,
        width: props.width,
        height: props.height,
        materials: props.materials,
        onLoadStart: props.onLoadStart ? true : undefined,
        onLoadEnd: props.onLoadEnd ? true : undefined,
        onError: props.onError ? true : undefined,
        onFinish: props.onFinish ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("animatedImage", nativeProps, "viro_root_scene");
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
        };
    }, [
        nodeId,
        props.onLoadStart,
        props.onLoadEnd,
        props.onError,
        props.onFinish,
    ]);
    // Animated image doesn't have children, so just return null
    return null;
};
exports.ViroAnimatedImage = ViroAnimatedImage;
//# sourceMappingURL=ViroAnimatedImage.js.map