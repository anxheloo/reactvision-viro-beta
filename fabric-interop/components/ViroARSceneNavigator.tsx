/**
 * ViroARSceneNavigator
 *
 * A component for rendering AR scenes.
 */

import React, { useState, useEffect } from "react";
import { ViroFabricContainer } from "../ViroFabricContainer";
import { getNativeViro } from "./ViroGlobal";

export interface ViroARSceneNavigatorProps {
  // Scene properties
  initialScene: {
    scene: React.ComponentType<any>;
  };

  // AR properties
  autofocus?: boolean;
  worldAlignment?: "Gravity" | "GravityAndHeading" | "Camera";
  videoQuality?: "High" | "Low";

  // Plane detection
  planeDetection?: {
    horizontal?: boolean;
    vertical?: boolean;
  };

  // Events
  onTrackingUpdated?: (event: { state: string; reason?: string }) => void;
  onARSessionFailed?: (error: string) => void;

  // Style
  style?: React.CSSProperties;
}

/**
 * ViroARSceneNavigator is a component for rendering AR scenes.
 * It provides a container for AR scenes and handles the AR session lifecycle.
 */
export const ViroARSceneNavigator: React.FC<ViroARSceneNavigatorProps> = (
  props
) => {
  const [apiKey] = useState<string>(() => {
    // Generate a random API key for demo purposes
    return `viro-${Math.random().toString(36).substring(2, 15)}`;
  });

  // Initialize AR session
  useEffect(() => {
    const nativeViro = getNativeViro();
    if (!nativeViro) return;

    // Initialize Viro
    nativeViro.initialize(apiKey);

    // Set plane detection
    if (props.planeDetection) {
      nativeViro.setViroARPlaneDetection({
        horizontal: props.planeDetection.horizontal ?? false,
        vertical: props.planeDetection.vertical ?? false,
      });
    }

    // Cleanup when unmounting
    return () => {
      // Cleanup code here
    };
  }, [apiKey, props.planeDetection]);

  // Create the scene component
  const SceneComponent = props.initialScene.scene;

  // Render the AR scene
  return (
    <ViroFabricContainer
      style={props.style}
      autofocus={props.autofocus}
      worldAlignment={props.worldAlignment}
      videoQuality={props.videoQuality}
      onTrackingUpdated={props.onTrackingUpdated}
      onARSessionFailed={props.onARSessionFailed}
    >
      <SceneComponent />
    </ViroFabricContainer>
  );
};
