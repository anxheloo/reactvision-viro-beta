"use strict";
/**
 * ViroPortal
 *
 * A component for creating portal entrances to other scenes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroPortal = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroPortal is a component for creating portal entrances to other scenes.
 * It acts as a doorway or window into another virtual environment.
 */
const ViroPortal = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        passable: props.passable,
        materials: props.materials,
        lightReceivingBitMask: props.lightReceivingBitMask,
        shadowCastingBitMask: props.shadowCastingBitMask,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("portal", nativeProps, "viro_root_scene");
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroPortal = ViroPortal;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
