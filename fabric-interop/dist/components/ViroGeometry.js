"use strict";
/**
 * ViroGeometry
 *
 * A component for rendering custom 3D geometry.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroGeometry = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroGeometry is a component for rendering custom 3D geometry.
 * It allows you to create custom 3D shapes by specifying vertices, normals,
 * texture coordinates, and triangle indices.
 */
const ViroGeometry = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        vertices: props.vertices,
        normals: props.normals,
        texcoords: props.texcoords,
        triangleIndices: props.triangleIndices,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
        type: props.type,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("geometry", nativeProps, "viro_root_scene");
    // Geometry doesn't have children, so just return null
    return null;
};
exports.ViroGeometry = ViroGeometry;
//# sourceMappingURL=ViroGeometry.js.map