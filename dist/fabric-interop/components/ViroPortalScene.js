"use strict";
/**
 * ViroPortalScene
 *
 * A component for creating the environment inside a portal.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroPortalScene = void 0;
const react_1 = __importDefault(require("react"));
const ViroUtils_1 = require("./ViroUtils");
const ViroGlobal_1 = require("./ViroGlobal");
/**
 * ViroPortalScene is a component for creating the environment inside a portal.
 * It contains the content that will be visible through a ViroPortal.
 */
const ViroPortalScene = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        passable: props.passable,
        onPortalEnter: props.onPortalEnter ? true : undefined,
        onPortalExit: props.onPortalExit ? true : undefined,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("portalScene", nativeProps, "viro_root_scene");
    // Register event handlers
    react_1.default.useEffect(() => {
        const nativeViro = (0, ViroGlobal_1.getNativeViro)();
        if (!nativeViro)
            return;
        // Register event handlers if provided
        if (props.onPortalEnter) {
            const callbackId = `${nodeId}_portal_enter`;
            nativeViro.registerEventCallback(nodeId, "onPortalEnter", callbackId);
        }
        if (props.onPortalExit) {
            const callbackId = `${nodeId}_portal_exit`;
            nativeViro.registerEventCallback(nodeId, "onPortalExit", callbackId);
        }
        // Cleanup when unmounting
        return () => {
            const nativeViro = (0, ViroGlobal_1.getNativeViro)();
            if (!nativeViro)
                return;
            if (props.onPortalEnter) {
                const callbackId = `${nodeId}_portal_enter`;
                nativeViro.unregisterEventCallback(nodeId, "onPortalEnter", callbackId);
            }
            if (props.onPortalExit) {
                const callbackId = `${nodeId}_portal_exit`;
                nativeViro.unregisterEventCallback(nodeId, "onPortalExit", callbackId);
            }
        };
    }, [nodeId, props.onPortalEnter, props.onPortalExit]);
    // Render children with this node as their parent
    return props.children ? (<ViroUtils_2.ViroContext.Provider value={nodeId}>{props.children}</ViroUtils_2.ViroContext.Provider>) : null;
};
exports.ViroPortalScene = ViroPortalScene;
// Import ViroContext at the top level to avoid circular dependencies
const ViroUtils_2 = require("./ViroUtils");
