"use strict";
/**
 * ViroSpotLight
 *
 * A component for adding spot lighting to a scene.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroSpotLight = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroSpotLight is a component for adding spot lighting to a scene.
 * Spot light is a type of light that illuminates objects in the scene
 * from a specific position and in a specific direction, with a cone-shaped beam.
 */
const ViroSpotLight = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        color: props.color,
        intensity: props.intensity,
        temperature: props.temperature,
        direction: props.direction,
        position: props.position,
        influenceBitMask: props.influenceBitMask,
        innerAngle: props.innerAngle,
        outerAngle: props.outerAngle,
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
    const nodeId = (0, ViroUtils_1.useViroNode)("spotLight", nativeProps, "viro_root_scene");
    // Spot light doesn't have children, so just return null
    return null;
};
exports.ViroSpotLight = ViroSpotLight;
