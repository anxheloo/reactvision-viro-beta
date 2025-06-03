"use strict";
/**
 * ViroAnimatedComponent
 *
 * A component for creating animated components.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroAnimatedComponent = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroAnimatedComponent is a component for creating animated components.
 * It allows you to apply animations to any Viro component.
 */
const ViroAnimatedComponent = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        animation: props.animation,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("animatedComponent", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro || !props.animation)
            return;
        // Register event handlers if provided
        if (props.animation.onStart) {
            const callbackId = `${nodeId}_animation_start`;
            nativeViro.registerEventCallback(nodeId, "onAnimationStart", callbackId);
        }
        if (props.animation.onFinish) {
            const callbackId = `${nodeId}_animation_finish`;
            nativeViro.registerEventCallback(nodeId, "onAnimationFinish", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro || !props.animation)
                return;
            if (props.animation.onStart) {
                const callbackId = `${nodeId}_animation_start`;
                nativeViro.unregisterEventCallback(nodeId, "onAnimationStart", callbackId);
            }
            if (props.animation.onFinish) {
                const callbackId = `${nodeId}_animation_finish`;
                nativeViro.unregisterEventCallback(nodeId, "onAnimationFinish", callbackId);
            }
        };
    }, [nodeId, props.animation]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroAnimatedComponent = ViroAnimatedComponent;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
