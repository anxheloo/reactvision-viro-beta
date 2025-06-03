"use strict";
/**
 * ViroFlexView
 *
 * A component for creating flexible layouts in 3D space.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroFlexView = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroFlexView is a component for creating flexible layouts in 3D space.
 * It allows you to arrange child components using flexbox-like layout rules.
 */
const ViroFlexView = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        width: props.width,
        height: props.height,
        flex: props.flex,
        flexDirection: props.flexDirection,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        padding: props.padding,
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
        materials: props.materials,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("flexView", nativeProps, "viro_root_scene");
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroFlexView = ViroFlexView;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
//# sourceMappingURL=ViroFlexView.js.map