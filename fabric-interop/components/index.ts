/**
 * Viro Component Wrappers
 *
 * This module exports React components that maintain the same API as the original
 * Viro components but use the Fabric interop layer internally.
 */

// Basic components
export { ViroNode } from "./ViroNode.tsx";
export { ViroScene } from "./ViroScene.tsx";
export { ViroARScene } from "./ViroARScene.tsx";
export { ViroFlexView } from "./ViroFlexView.tsx";

// 3D primitives
export { ViroBox } from "./ViroBox.tsx";
export { ViroSphere } from "./ViroSphere.tsx";
export { Viro3DObject } from "./Viro3DObject.tsx";
export { ViroGeometry } from "./ViroGeometry.tsx";
export { ViroQuad } from "./ViroQuad.tsx";
export { ViroPolygon } from "./ViroPolygon.tsx";
export { ViroPolyline } from "./ViroPolyline.tsx";
export { ViroSurface } from "./ViroSurface.tsx";

// 2D components
export { ViroText } from "./ViroText.tsx";
export { ViroImage } from "./ViroImage.tsx";
export { ViroVideo } from "./ViroVideo.tsx";
export { ViroAnimatedImage } from "./ViroAnimatedImage.tsx";

// 360 components
export { Viro360Image } from "./Viro360Image.tsx";
export { Viro360Video } from "./Viro360Video.tsx";
export { ViroSkyBox } from "./ViroSkyBox.tsx";

// Portal components
export { ViroPortal } from "./ViroPortal.tsx";
export { ViroPortalScene } from "./ViroPortalScene.tsx";

// Lights
export { ViroAmbientLight } from "./ViroAmbientLight.tsx";
export { ViroDirectionalLight } from "./ViroDirectionalLight.tsx";
export { ViroSpotLight } from "./ViroSpotLight.tsx";
export { ViroOmniLight } from "./ViroOmniLight.tsx";
export { ViroLightingEnvironment } from "./ViroLightingEnvironment.tsx";

// Cameras
export { ViroCamera } from "./ViroCamera.tsx";
export { ViroOrbitCamera } from "./ViroOrbitCamera.tsx";

// Audio
export { ViroSound } from "./ViroSound.tsx";
export { ViroSoundField } from "./ViroSoundField.tsx";
export { ViroSpatialSound } from "./ViroSpatialSound.tsx";

// Interactive components
export { ViroButton } from "./ViroButton.tsx";
export { ViroController } from "./ViroController.tsx";

// Effects
export { ViroParticleEmitter } from "./ViroParticleEmitter.tsx";
export { ViroAnimatedComponent } from "./ViroAnimatedComponent.tsx";
export { ViroMaterialVideo } from "./ViroMaterialVideo.tsx";

// Scene navigators
export { ViroSceneNavigator } from "./ViroSceneNavigator.tsx";
export { ViroVRSceneNavigator } from "./ViroVRSceneNavigator.tsx";
export { ViroARSceneNavigator } from "./ViroARSceneNavigator.tsx";

// AR components
export { ViroARCamera } from "./ViroARCamera.tsx";
export { ViroARPlane } from "./ViroARPlane.tsx";
export { ViroARImageMarker } from "./ViroARImageMarker.tsx";
export { ViroARObjectMarker } from "./ViroARObjectMarker.tsx";

// Utilities
export * from "./ViroUtils.ts";

// Animation utilities
export * from "./Animation/ViroAnimations.ts";
import ViroAnimations from "./Animation/ViroAnimations.ts";
export { ViroAnimations };

// Material utilities
export * from "./Material/ViroMaterials.ts";
import ViroMaterials from "./Material/ViroMaterials.ts";
export { ViroMaterials };

// AR utilities
export * from "./AR/ViroARTrackingTargets.ts";
import ViroARTrackingTargets from "./AR/ViroARTrackingTargets.ts";
export { ViroARTrackingTargets };
