/**
 * ViroController
 *
 * A component for handling VR controller input.
 */
import React from "react";
import { ViroCommonProps, ViroEventHandler } from "./ViroUtils";
export interface ViroControllerProps extends ViroCommonProps {
    hand?: "LEFT" | "RIGHT" | "NONE";
    visible?: boolean;
    onControllerStatus?: ViroEventHandler;
    children?: React.ReactNode;
}
/**
 * ViroController is a component for handling VR controller input.
 * It represents a physical VR controller in the virtual environment.
 */
export declare const ViroController: React.FC<ViroControllerProps>;
