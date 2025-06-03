"use strict";
/**
 * ViroAmbientLight
 *
 * A component for adding ambient lighting to a scene.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroAmbientLight = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroAmbientLight is a component for adding ambient lighting to a scene.
 * Ambient light is a type of light that illuminates all objects in the scene equally,
 * regardless of their position or orientation.
 */
const ViroAmbientLight = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        color: props.color,
        intensity: props.intensity,
        temperature: props.temperature,
        influenceBitMask: props.influenceBitMask,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("ambientLight", nativeProps, "viro_root_scene");
    // Ambient light doesn't have children, so just return null
    return null;
};
exports.ViroAmbientLight = ViroAmbientLight;
