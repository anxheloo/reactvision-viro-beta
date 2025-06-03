"use strict";
/**
 * ViroOmniLight
 *
 * A component for adding omnidirectional lighting to a scene.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroOmniLight = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroOmniLight is a component for adding omnidirectional lighting to a scene.
 * Omni light is a type of light that illuminates objects in the scene
 * from a specific position in all directions, like a light bulb.
 */
const ViroOmniLight = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        color: props.color,
        intensity: props.intensity,
        temperature: props.temperature,
        position: props.position,
        influenceBitMask: props.influenceBitMask,
        attenuationStartDistance: props.attenuationStartDistance,
        attenuationEndDistance: props.attenuationEndDistance,
        castsShadow: props.castsShadow,
        shadowOpacity: props.shadowOpacity,
        shadowMapSize: props.shadowMapSize,
        shadowBias: props.shadowBias,
        shadowNearZ: props.shadowNearZ,
        shadowFarZ: props.shadowFarZ,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("omniLight", nativeProps, "viro_root_scene");
    // Omni light doesn't have children, so just return null
    return null;
};
exports.ViroOmniLight = ViroOmniLight;
//# sourceMappingURL=ViroOmniLight.js.map