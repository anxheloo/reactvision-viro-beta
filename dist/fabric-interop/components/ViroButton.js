"use strict";
/**
 * ViroButton
 *
 * A component for creating interactive buttons in 3D space.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroButton = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroButton is a component for creating interactive buttons in 3D space.
 * It supports different visual states for normal, hover, and click interactions.
 */
const ViroButton = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        width: props.width,
        height: props.height,
        source: props.source,
        hoverSource: props.hoverSource,
        clickSource: props.clickSource,
        materials: props.materials,
        hoverMaterials: props.hoverMaterials,
        clickMaterials: props.clickMaterials,
        enabled: props.enabled,
        onHover: props.onHover ? true : undefined,
        onClick: props.onClick ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("button", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onHover) {
            const callbackId = `${nodeId}_hover`;
            nativeViro.registerEventCallback(nodeId, "onHover", callbackId);
        }
        if (props.onClick) {
            const callbackId = `${nodeId}_click`;
            nativeViro.registerEventCallback(nodeId, "onClick", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onHover) {
                const callbackId = `${nodeId}_hover`;
                nativeViro.unregisterEventCallback(nodeId, "onHover", callbackId);
            }
            if (props.onClick) {
                const callbackId = `${nodeId}_click`;
                nativeViro.unregisterEventCallback(nodeId, "onClick", callbackId);
            }
        };
    }, [nodeId, props.onHover, props.onClick]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroButton = ViroButton;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
