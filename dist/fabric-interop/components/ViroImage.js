"use strict";
/**
 * ViroImage
 *
 * A component for displaying 2D images in 3D space.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroImage = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroImage is a component for displaying 2D images in 3D space.
 */
const ViroImage = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        source: props.source,
        width: props.width,
        height: props.height,
        resizeMode: props.resizeMode,
        imageClipMode: props.imageClipMode,
        stereoMode: props.stereoMode,
        format: props.format,
        mipmap: props.mipmap,
        placeholderSource: props.placeholderSource,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("image", nativeProps, "viro_root_scene");
    // Image doesn't have children, so just return null
    return null;
};
exports.ViroImage = ViroImage;
