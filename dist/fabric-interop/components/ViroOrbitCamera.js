"use strict";
/**
 * ViroOrbitCamera
 *
 * A specialized camera that orbits around a target point.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroOrbitCamera = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroOrbitCamera is a specialized camera that orbits around a target point.
 * It provides controls for zooming, panning, and rotating around the focal point.
 */
const ViroOrbitCamera = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        position: props.position,
        active: props.active,
        fieldOfView: props.fieldOfView,
        focalPoint: props.focalPoint,
        focalDistance: props.focalDistance,
        enableZoom: props.enableZoom,
        enablePan: props.enablePan,
        enableRotate: props.enableRotate,
        enableFling: props.enableFling,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        minPan: props.minPan,
        maxPan: props.maxPan,
        minRotation: props.minRotation,
        maxRotation: props.maxRotation,
        onTransformUpdate: props.onTransformUpdate ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("orbitCamera", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        if (!global.NativeViro)
            return;
        // Register event handlers if provided
        if (props.onTransformUpdate) {
            const callbackId = `${nodeId}_transform_update`;
            global.NativeViro.registerEventCallback(nodeId, "onTransformUpdate", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            if (!global.NativeViro)
                return;
            if (props.onTransformUpdate) {
                const callbackId = `${nodeId}_transform_update`;
                global.NativeViro.unregisterEventCallback(nodeId, "onTransformUpdate", callbackId);
            }
        };
    }, [nodeId, props.onTransformUpdate]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroOrbitCamera = ViroOrbitCamera;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
