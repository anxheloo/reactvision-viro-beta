"use strict";
/**
 * ViroCamera
 *
 * A component for controlling the camera in a scene.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroCamera = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroCamera is a component for controlling the camera in a scene.
 * It defines the viewpoint from which the scene is rendered.
 */
const ViroCamera = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        position: props.position,
        rotation: props.rotation,
        active: props.active,
        fieldOfView: props.fieldOfView,
        onTransformUpdate: props.onTransformUpdate ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("camera", nativeProps, "viro_root_scene");
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
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onTransformUpdate) {
                const callbackId = `${nodeId}_transform_update`;
                nativeViro.unregisterEventCallback(nodeId, "onTransformUpdate", callbackId);
            }
        };
    }, [nodeId, props.onTransformUpdate]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroCamera = ViroCamera;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
