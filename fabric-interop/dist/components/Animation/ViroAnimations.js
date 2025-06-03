"use strict";
/**
 * ViroAnimations
 *
 * A utility for creating and managing animations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAnimations = registerAnimations;
exports.getAnimation = getAnimation;
exports.getAllAnimations = getAllAnimations;
exports.executeAnimation = executeAnimation;
// Animation registry
const animations = {};
/**
 * Register animations with the Viro system.
 * @param animationMap A map of animation names to animation definitions.
 */
function registerAnimations(animationMap) {
    // Add animations to the registry
    Object.entries(animationMap).forEach(([name, definition]) => {
        animations[name] = definition;
        // Register with native code if available
        if (global.NativeViro) {
            global.NativeViro.createViroAnimation(name, definition);
        }
    });
}
/**
 * Get an animation by name.
 * @param name The name of the animation.
 * @returns The animation definition, or undefined if not found.
 */
function getAnimation(name) {
    return animations[name];
}
/**
 * Get all registered animations.
 * @returns A map of animation names to animation definitions.
 */
function getAllAnimations() {
    return { ...animations };
}
/**
 * Execute an animation on a node.
 * @param nodeId The ID of the node to animate.
 * @param animationName The name of the animation to execute.
 * @param options Options for the animation execution.
 */
function executeAnimation(nodeId, animationName, options = {}) {
    if (!global.NativeViro)
        return;
    global.NativeViro.executeViroAnimation(nodeId, animationName, options);
}
// Export the animations object as the default export
const ViroAnimations = {
    registerAnimations,
    getAnimation,
    getAllAnimations,
    executeAnimation,
};
exports.default = ViroAnimations;
//# sourceMappingURL=ViroAnimations.js.map