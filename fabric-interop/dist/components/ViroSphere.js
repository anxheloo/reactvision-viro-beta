"use strict";
/**
 * ViroSphere
 *
 * A 3D sphere component with customizable radius and materials.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroSphere = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroSphere is a 3D sphere component with customizable radius and materials.
 */
const ViroSphere = (props) => {
    var _a;
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        radius: (_a = props.radius) !== null && _a !== void 0 ? _a : 1,
        facesCount: props.facesCount,
        segmentCount: props.segmentCount,
        widthSegmentCount: props.widthSegmentCount,
        heightSegmentCount: props.heightSegmentCount,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
        highAccuracyEvents: props.highAccuracyEvents,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("sphere", nativeProps, "viro_root_scene");
    // Sphere doesn't have children, so just return null
    return null;
};
exports.ViroSphere = ViroSphere;
//# sourceMappingURL=ViroSphere.js.map