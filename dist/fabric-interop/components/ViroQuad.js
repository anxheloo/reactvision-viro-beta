"use strict";
/**
 * ViroQuad
 *
 * A component for rendering a 2D quad in 3D space.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroQuad = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroQuad is a component for rendering a 2D quad in 3D space.
 * It's a flat rectangular surface that can be used for various purposes,
 * such as displaying images, videos, or creating simple geometric shapes.
 */
const ViroQuad = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        width: props.width ?? 1,
        height: props.height ?? 1,
        uvCoordinates: props.uvCoordinates,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
        arShadowReceiver: props.arShadowReceiver,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("quad", nativeProps, "viro_root_scene");
    // Quad doesn't have children, so just return null
    return null;
};
exports.ViroQuad = ViroQuad;
