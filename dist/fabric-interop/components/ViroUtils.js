"use strict";
/**
 * ViroUtils
 *
 * Common utility functions and hooks for Viro components.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroContext = void 0;
exports.useViroNode = useViroNode;
exports.useViroChildren = useViroChildren;
exports.convertCommonProps = convertCommonProps;
const react_1 = require("react");
const NativeViro_1 = require("../NativeViro");
// Hook to manage a node's lifecycle
function useViroNode(nodeType, props, parentId) {
    const nodeId = (0, react_1.useRef)((0, NativeViro_1.generateNodeId)());
    (0, react_1.useEffect)(() => {
        // Create the node when the component mounts
        if (global.NativeViro) {
            global.NativeViro.createViroNode(nodeId.current, nodeType, props);
            // Add to parent if specified
            if (parentId) {
                global.NativeViro.addViroNodeChild(parentId, nodeId.current);
            }
        }
        // Clean up when the component unmounts
        return () => {
            if (global.NativeViro) {
                // Remove from parent if specified
                if (parentId) {
                    global.NativeViro.removeViroNodeChild(parentId, nodeId.current);
                }
                // Delete the node
                global.NativeViro.deleteViroNode(nodeId.current);
            }
        };
    }, [nodeType, parentId]);
    // Update props when they change
    (0, react_1.useEffect)(() => {
        if (global.NativeViro) {
            global.NativeViro.updateViroNode(nodeId.current, props);
        }
    }, [props]);
    return nodeId.current;
}
// Hook to manage a node's children
function useViroChildren(nodeId, children) {
    // Create a context provider to pass the parent ID to children
    return children;
}
// Helper to convert common props to the format expected by the native code
function convertCommonProps(props) {
    const { position, rotation, scale, transformBehaviors, opacity, visible, animation, ...rest } = props;
    const convertedProps = {
        ...rest,
    };
    if (position)
        convertedProps.position = position;
    if (rotation)
        convertedProps.rotation = rotation;
    if (scale !== undefined) {
        if (typeof scale === "number") {
            convertedProps.scale = [scale, scale, scale];
        }
        else {
            convertedProps.scale = scale;
        }
    }
    if (transformBehaviors)
        convertedProps.transformBehaviors = transformBehaviors;
    if (opacity !== undefined)
        convertedProps.opacity = opacity;
    if (visible !== undefined)
        convertedProps.visible = visible;
    if (animation)
        convertedProps.animation = animation;
    return convertedProps;
}
// Create a ViroContext to pass parent node IDs down the component tree
exports.ViroContext = {
    Provider: ({ value, children, }) => children,
    Consumer: ({ children, }) => children("viro_root_scene"),
};
