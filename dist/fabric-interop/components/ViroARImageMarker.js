"use strict";
/**
 * ViroARImageMarker
 *
 * A component for detecting and tracking images in the real world.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroARImageMarker = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroARImageMarker is a component for detecting and tracking images in the real world.
 * It allows you to attach virtual content to real-world images, such as posters, book covers, or logos.
 */
const ViroARImageMarker = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        target: props.target,
        visible: props.visible,
        opacity: props.opacity,
        onAnchorFound: props.onAnchorFound ? true : undefined,
        onAnchorUpdated: props.onAnchorUpdated ? true : undefined,
        onAnchorRemoved: props.onAnchorRemoved ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("arImageMarker", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        if (!global.NativeViro)
            return;
        // Register event handlers if provided
        if (props.onAnchorFound) {
            const callbackId = `${nodeId}_anchor_found`;
            global.NativeViro.registerEventCallback(nodeId, "onAnchorFound", callbackId);
        }
        if (props.onAnchorUpdated) {
            const callbackId = `${nodeId}_anchor_updated`;
            global.NativeViro.registerEventCallback(nodeId, "onAnchorUpdated", callbackId);
        }
        if (props.onAnchorRemoved) {
            const callbackId = `${nodeId}_anchor_removed`;
            global.NativeViro.registerEventCallback(nodeId, "onAnchorRemoved", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            if (!global.NativeViro)
                return;
            if (props.onAnchorFound) {
                const callbackId = `${nodeId}_anchor_found`;
                global.NativeViro.unregisterEventCallback(nodeId, "onAnchorFound", callbackId);
            }
            if (props.onAnchorUpdated) {
                const callbackId = `${nodeId}_anchor_updated`;
                global.NativeViro.unregisterEventCallback(nodeId, "onAnchorUpdated", callbackId);
            }
            if (props.onAnchorRemoved) {
                const callbackId = `${nodeId}_anchor_removed`;
                global.NativeViro.unregisterEventCallback(nodeId, "onAnchorRemoved", callbackId);
            }
        };
    }, [
        nodeId,
        props.onAnchorFound,
        props.onAnchorUpdated,
        props.onAnchorRemoved,
    ]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroARImageMarker = ViroARImageMarker;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
