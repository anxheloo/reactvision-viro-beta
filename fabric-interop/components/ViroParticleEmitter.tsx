/**
 * ViroParticleEmitter
 *
 * A component for creating particle effects.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroParticleEmitterProps extends ViroCommonProps {
  // Particle source
  image?: { uri: string } | number;

  // Emission properties
  delay?: number;
  duration?: number;
  loop?: boolean;
  run?: boolean;
  fixedToEmitter?: boolean;

  // Particle appearance
  spawnBehavior?: {
    particleLifetime?: [number, number];
    emissionRatePerSecond?: [number, number];
    emissionRatePerDistance?: number;
    particleCount?: number;
    maxParticles?: number;
    emissionBurst?: Array<{
      time?: number;
      min?: number;
      max?: number;
      cycles?: number;
      cooldownPeriod?: number;
    }>;
  };

  // Particle physics
  particleAppearance?: {
    opacity?: {
      initialRange?: [number, number];
      factor?: "Time" | "Distance";
      interpolation?: Array<{
        interval?: [number, number];
        endValue?: number;
      }>;
    };
    scale?: {
      initialRange?: [[number, number, number], [number, number, number]];
      factor?: "Time" | "Distance";
      interpolation?: Array<{
        interval?: [number, number];
        endValue?: [number, number, number];
      }>;
    };
    rotation?: {
      initialRange?: [[number, number, number], [number, number, number]];
      factor?: "Time" | "Distance";
      interpolation?: Array<{
        interval?: [number, number];
        endValue?: [number, number, number];
      }>;
    };
    color?: {
      initialRange?: [string, string];
      factor?: "Time" | "Distance";
      interpolation?: Array<{
        interval?: [number, number];
        endValue?: string;
      }>;
    };
  };

  // Particle physics
  particlePhysics?: {
    velocity?: {
      initialRange?: [[number, number, number], [number, number, number]];
    };
    acceleration?: {
      initialRange?: [[number, number, number], [number, number, number]];
    };
    explosiveImpulse?: {
      impulse?: number;
      position?: [number, number, number];
      decelerationPeriod?: number;
    };
  };
}

/**
 * ViroParticleEmitter is a component for creating particle effects.
 * It can be used to create effects like fire, smoke, rain, snow, etc.
 */
export const ViroParticleEmitter: React.FC<ViroParticleEmitterProps> = (
  props
) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
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
  const nodeId = useViroNode("particle", nativeProps, "viro_root_scene");

  // Particle emitter doesn't have children, so just return null
  return null;
};
