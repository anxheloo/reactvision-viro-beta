/**
 * ViroParticleEmitter
 *
 * A component for creating particle effects.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroParticleEmitterProps extends ViroCommonProps {
    image?: {
        uri: string;
    } | number;
    delay?: number;
    duration?: number;
    loop?: boolean;
    run?: boolean;
    fixedToEmitter?: boolean;
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
export declare const ViroParticleEmitter: React.FC<ViroParticleEmitterProps>;
