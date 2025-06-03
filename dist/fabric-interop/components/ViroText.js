"use strict";
/**
 * ViroText
 *
 * A component for rendering 3D text in the Viro scene.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroText = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroText is a component for rendering 3D text in the Viro scene.
 */
const ViroText = (props) => {
    // Get the parent node ID from context
    const parentId = "viro_root_scene"; // Default to root scene
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        text: props.text,
        color: props.color,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        fontStyle: props.fontStyle,
        textAlign: props.textAlign,
        textAlignVertical: props.textAlignVertical,
        textLineBreakMode: props.textLineBreakMode,
        textClipMode: props.textClipMode,
        width: props.width,
        height: props.height,
        maxWidth: props.maxWidth,
        maxHeight: props.maxHeight,
        materials: props.materials,
        extrusionDepth: props.extrusionDepth,
        outerStroke: props.outerStroke,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("text", nativeProps, parentId);
    // Text doesn't have children, so just return null
    return null;
};
exports.ViroText = ViroText;
