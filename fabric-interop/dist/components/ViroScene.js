"use strict";
/**
 * ViroScene
 *
 * A container for 3D content in the Viro scene graph.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroScene = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroScene is a container for 3D content in the Viro scene graph.
 */
const ViroScene = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        displayPointCloud: props.displayPointCloud,
        pointCloudColor: props.pointCloudColor,
        pointCloudSize: props.pointCloudSize,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
        physicsWorld: props.physicsWorld,
        postProcessEffects: props.postProcessEffects,
        onPlatformUpdate: props.onPlatformUpdate ? true : undefined,
        onCameraTransformUpdate: props.onCameraTransformUpdate ? true : undefined,
        onAmbientLightUpdate: props.onAmbientLightUpdate ? true : undefined,
    };
    // Create the scene node - this is a root node, so no parent
    const nodeId = (0, ViroUtils_1.useViroNode)("scene", nativeProps);
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onPlatformUpdate) {
            const callbackId = `${nodeId}_platform_update`;
            nativeViro.registerEventCallback(nodeId, "onPlatformUpdate", callbackId);
        }
        if (props.onCameraTransformUpdate) {
            const callbackId = `${nodeId}_camera_transform_update`;
            nativeViro.registerEventCallback(nodeId, "onCameraTransformUpdate", callbackId);
        }
        if (props.onAmbientLightUpdate) {
            const callbackId = `${nodeId}_ambient_light_update`;
            nativeViro.registerEventCallback(nodeId, "onAmbientLightUpdate", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onPlatformUpdate) {
                const callbackId = `${nodeId}_platform_update`;
                nativeViro.unregisterEventCallback(nodeId, "onPlatformUpdate", callbackId);
            }
            if (props.onCameraTransformUpdate) {
                const callbackId = `${nodeId}_camera_transform_update`;
                nativeViro.unregisterEventCallback(nodeId, "onCameraTransformUpdate", callbackId);
            }
            if (props.onAmbientLightUpdate) {
                const callbackId = `${nodeId}_ambient_light_update`;
                nativeViro.unregisterEventCallback(nodeId, "onAmbientLightUpdate", callbackId);
            }
        };
    }, [
        nodeId,
        props.onPlatformUpdate,
        props.onCameraTransformUpdate,
        props.onAmbientLightUpdate,
    ]);
    // Render children with this scene as their parent
    return (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>);
};
exports.ViroScene = ViroScene;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
//# sourceMappingURL=ViroScene.js.map