"use strict";
/**
 * ViroPolygon
 *
 * A component for rendering a 2D polygon in 3D space.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroPolygon = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroPolygon is a component for rendering a 2D polygon in 3D space.
 * It allows you to create complex 2D shapes by specifying a list of vertices.
 * You can also create holes in the polygon by specifying a list of hole vertices.
 */
const ViroPolygon = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        vertices: props.vertices,
        holes: props.holes,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("polygon", nativeProps, "viro_root_scene");
    // Polygon doesn't have children, so just return null
    return null;
};
exports.ViroPolygon = ViroPolygon;
//# sourceMappingURL=ViroPolygon.js.map