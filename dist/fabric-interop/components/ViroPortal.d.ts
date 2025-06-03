/**
 * ViroPortal
 *
 * A component for creating portal entrances to other scenes.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroPortalProps extends ViroCommonProps {
    passable?: boolean;
    materials?: string | string[];
    lightReceivingBitMask?: number;
    shadowCastingBitMask?: number;
    children?: React.ReactNode;
}
/**
 * ViroPortal is a component for creating portal entrances to other scenes.
 * It acts as a doorway or window into another virtual environment.
 */
export declare const ViroPortal: React.FC<ViroPortalProps>;
