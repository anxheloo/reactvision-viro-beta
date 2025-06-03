/**
 * ViroPortalScene
 *
 * A component for creating the environment inside a portal.
 */
import React from "react";
import { ViroCommonProps } from "./ViroUtils";
export interface ViroPortalSceneProps extends ViroCommonProps {
    passable?: boolean;
    onPortalEnter?: () => void;
    onPortalExit?: () => void;
    children?: React.ReactNode;
}
/**
 * ViroPortalScene is a component for creating the environment inside a portal.
 * It contains the content that will be visible through a ViroPortal.
 */
export declare const ViroPortalScene: React.FC<ViroPortalSceneProps>;
