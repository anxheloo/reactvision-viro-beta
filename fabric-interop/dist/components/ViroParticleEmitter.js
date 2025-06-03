"use strict";
/**
 * ViroParticleEmitter
 *
 * A component for creating particle effects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroParticleEmitter = void 0;
const ViroUtils_1 = require("./ViroUtils");
/**
 * ViroParticleEmitter is a component for creating particle effects.
 * It can be used to create effects like fire, smoke, rain, snow, etc.
 */
const ViroParticleEmitter = (props) => {
    // Convert common props to the format expected by the native code
    const nativeProps = {
        ...(0, ViroUtils_1.convertCommonProps)(props),
        image: props.image,
        delay: props.delay,
        duration: props.duration,
        loop: props.loop,
        run: props.run,
        fixedToEmitter: props.fixedToEmitter,
        spawnBehavior: props.spawnBehavior,
        particleAppearance: props.particleAppearance,
        particlePhysics: props.particlePhysics,
    };
    // Create the node
    const nodeId = (0, ViroUtils_1.useViroNode)("particle", nativeProps, "viro_root_scene");
    // Particle emitter doesn't have children, so just return null
    return null;
};
exports.ViroParticleEmitter = ViroParticleEmitter;
//# sourceMappingURL=ViroParticleEmitter.js.map