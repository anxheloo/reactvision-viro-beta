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
    var _a, _b, _c;
    // Get the parent node ID from context
    const parentId = "viro_root_scene"; // Default to root scene
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        width: (_a = props.width) !== null && _a !== void 0 ? _a : 1,
        height: (_b = props.height) !== null && _b !== void 0 ? _b : 1,
        length: (_c = props.length) !== null && _c !== void 0 ? _c : 1,
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
//# sourceMappingURL=ViroBox.js.map