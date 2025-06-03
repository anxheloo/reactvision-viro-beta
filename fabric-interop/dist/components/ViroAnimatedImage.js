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
const ViroGlobal_1 = require("./ViroGlobal");
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
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onLoadStart) {
            const callbackId = `${nodeId}_load_start`;
            nativeViro.registerEventCallback(nodeId, "onLoadStart", callbackId);
        }
        if (props.onLoadEnd) {
            const callbackId = `${nodeId}_load_end`;
            nativeViro.registerEventCallback(nodeId, "onLoadEnd", callbackId);
        }
        if (props.onError) {
            const callbackId = `${nodeId}_error`;
            nativeViro.registerEventCallback(nodeId, "onError", callbackId);
        }
        if (props.onFinish) {
            const callbackId = `${nodeId}_finish`;
            nativeViro.registerEventCallback(nodeId, "onFinish", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onLoadStart) {
                const callbackId = `${nodeId}_load_start`;
                nativeViro.unregisterEventCallback(nodeId, "onLoadStart", callbackId);
            }
            if (props.onLoadEnd) {
                const callbackId = `${nodeId}_load_end`;
                nativeViro.unregisterEventCallback(nodeId, "onLoadEnd", callbackId);
            }
            if (props.onError) {
                const callbackId = `${nodeId}_error`;
                nativeViro.unregisterEventCallback(nodeId, "onError", callbackId);
            }
            if (props.onFinish) {
                const callbackId = `${nodeId}_finish`;
                nativeViro.unregisterEventCallback(nodeId, "onFinish", callbackId);
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