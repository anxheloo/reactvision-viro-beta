/**
 * ViroButton
 *
 * A component for creating interactive buttons in 3D space.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroButtonProps extends ViroCommonProps {
    width?: number;
    height?: number;
    source?: {
        uri: string;
    } | number;
    hoverSource?: {
        uri: string;
    } | number;
    clickSource?: {
        uri: string;
    } | number;
    materials?: string | string[];
    hoverMaterials?: string | string[];
    clickMaterials?: string | string[];
    enabled?: boolean;
    onHover?: (isHovering: boolean) => void;
    onClick?: () => void;
    children?: React.ReactNode;
}
/**
 * ViroButton is a component for creating interactive buttons in 3D space.
 * It supports different visual states for normal, hover, and click interactions.
 */
export declare const ViroButton: React.FC<ViroButtonProps>;
