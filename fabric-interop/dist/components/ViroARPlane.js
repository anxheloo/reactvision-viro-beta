"use strict";
/**
 * ViroARPlane
 *
 * A component for rendering AR planes detected by the AR system.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroARPlane = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroARPlane is a component for rendering AR planes detected by the AR system.
 * It represents a real-world surface detected by the AR system, such as a floor, table, or wall.
 */
const ViroARPlane = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        alignment: props.alignment,
        minHeight: props.minHeight,
        minWidth: props.minWidth,
        visible: props.visible,
        opacity: props.opacity,
        materials: props.materials,
        onAnchorFound: props.onAnchorFound ? true : undefined,
        onAnchorUpdated: props.onAnchorUpdated ? true : undefined,
        onAnchorRemoved: props.onAnchorRemoved ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("arPlane", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onAnchorFound) {
            const callbackId = `${nodeId}_anchor_found`;
            nativeViro.registerEventCallback(nodeId, "onAnchorFound", callbackId);
        }
        if (props.onAnchorUpdated) {
            const callbackId = `${nodeId}_anchor_updated`;
            nativeViro.registerEventCallback(nodeId, "onAnchorUpdated", callbackId);
        }
        if (props.onAnchorRemoved) {
            const callbackId = `${nodeId}_anchor_removed`;
            nativeViro.registerEventCallback(nodeId, "onAnchorRemoved", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onAnchorFound) {
                const callbackId = `${nodeId}_anchor_found`;
                nativeViro.unregisterEventCallback(nodeId, "onAnchorFound", callbackId);
            }
            if (props.onAnchorUpdated) {
                const callbackId = `${nodeId}_anchor_updated`;
                nativeViro.unregisterEventCallback(nodeId, "onAnchorUpdated", callbackId);
            }
            if (props.onAnchorRemoved) {
                const callbackId = `${nodeId}_anchor_removed`;
                nativeViro.unregisterEventCallback(nodeId, "onAnchorRemoved", callbackId);
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
exports.ViroARPlane = ViroARPlane;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
//# sourceMappingURL=ViroARPlane.js.map