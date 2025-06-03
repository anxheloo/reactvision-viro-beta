"use strict";
/**
 * ViroARCamera
 *
 * A component for controlling the camera in an AR scene.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroARCamera = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroARCamera is a component for controlling the camera in an AR scene.
 * It provides information about the camera's position and orientation in the real world,
 * as well as tracking state updates.
 */
const ViroARCamera = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        active: props.active,
        onTransformUpdate: props.onTransformUpdate ? true : undefined,
        onTrackingUpdated: props.onTrackingUpdated ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("arCamera", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onTransformUpdate) {
            const callbackId = `${nodeId}_transform_update`;
            nativeViro.registerEventCallback(nodeId, "onTransformUpdate", callbackId);
        }
        if (props.onTrackingUpdated) {
            const callbackId = `${nodeId}_tracking_updated`;
            nativeViro.registerEventCallback(nodeId, "onTrackingUpdated", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onTransformUpdate) {
                const callbackId = `${nodeId}_transform_update`;
                nativeViro.unregisterEventCallback(nodeId, "onTransformUpdate", callbackId);
            }
            if (props.onTrackingUpdated) {
                const callbackId = `${nodeId}_tracking_updated`;
                nativeViro.unregisterEventCallback(nodeId, "onTrackingUpdated", callbackId);
            }
        };
    }, [nodeId, props.onTransformUpdate, props.onTrackingUpdated]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroARCamera = ViroARCamera;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
//# sourceMappingURL=ViroARCamera.js.map