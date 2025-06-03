"use strict";
/**
 * ViroController
 *
 * A component for handling VR controller input.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroController = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroController is a component for handling VR controller input.
 * It represents a physical VR controller in the virtual environment.
 */
const ViroController = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        hand: props.hand,
        visible: props.visible,
        onClick: props.onClick ? true : undefined,
        onDrag: props.onDrag ? true : undefined,
        onFuse: props.onFuse ? true : undefined,
        onPinch: props.onPinch ? true : undefined,
        onRotate: props.onRotate ? true : undefined,
        onControllerStatus: props.onControllerStatus ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("controller", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onClick) {
            const callbackId = `${nodeId}_click`;
            nativeViro.registerEventCallback(nodeId, "onClick", callbackId);
        }
        if (props.onDrag) {
            const callbackId = `${nodeId}_drag`;
            nativeViro.registerEventCallback(nodeId, "onDrag", callbackId);
        }
        if (props.onFuse) {
            const callbackId = `${nodeId}_fuse`;
            nativeViro.registerEventCallback(nodeId, "onFuse", callbackId);
        }
        if (props.onPinch) {
            const callbackId = `${nodeId}_pinch`;
            nativeViro.registerEventCallback(nodeId, "onPinch", callbackId);
        }
        if (props.onRotate) {
            const callbackId = `${nodeId}_rotate`;
            nativeViro.registerEventCallback(nodeId, "onRotate", callbackId);
        }
        if (props.onControllerStatus) {
            const callbackId = `${nodeId}_controller_status`;
            nativeViro.registerEventCallback(nodeId, "onControllerStatus", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onClick) {
                const callbackId = `${nodeId}_click`;
                nativeViro.unregisterEventCallback(nodeId, "onClick", callbackId);
            }
            if (props.onDrag) {
                const callbackId = `${nodeId}_drag`;
                nativeViro.unregisterEventCallback(nodeId, "onDrag", callbackId);
            }
            if (props.onFuse) {
                const callbackId = `${nodeId}_fuse`;
                nativeViro.unregisterEventCallback(nodeId, "onFuse", callbackId);
            }
            if (props.onPinch) {
                const callbackId = `${nodeId}_pinch`;
                nativeViro.unregisterEventCallback(nodeId, "onPinch", callbackId);
            }
            if (props.onRotate) {
                const callbackId = `${nodeId}_rotate`;
                nativeViro.unregisterEventCallback(nodeId, "onRotate", callbackId);
            }
            if (props.onControllerStatus) {
                const callbackId = `${nodeId}_controller_status`;
                nativeViro.unregisterEventCallback(nodeId, "onControllerStatus", callbackId);
            }
        };
    }, [
        nodeId,
        props.onClick,
        props.onDrag,
        props.onFuse,
        props.onPinch,
        props.onRotate,
        props.onControllerStatus,
    ]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroController = ViroController;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
//# sourceMappingURL=ViroController.js.map