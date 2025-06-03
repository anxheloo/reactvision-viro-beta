"use strict";
/**
 * ViroBox
 *
 * A 3D box component with customizable dimensions and materials.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroBox = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroBox is a 3D box component with customizable dimensions and materials.
 */
const ViroBox = (props) => {
    // Get the parent node ID from context
    const parentId = "viro_root_scene"; // Default to root scene
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        width: props.width ?? 1,
        height: props.height ?? 1,
        length: props.length ?? 1,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
        highAccuracyEvents: props.highAccuracyEvents,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("box", nativeProps, parentId);
    // Box doesn't have children, so just return null
    return null;
};
exports.ViroBox = ViroBox;
