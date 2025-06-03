# React Native New Architecture Implementation for Viro

This document outlines the steps we've taken and the steps that still need to be taken to support React Native's New Architecture in the Viro library.

## Current Progress

### 1. TypeScript Improvements

We've made the following improvements to the TypeScript code to better support the New Architecture:

- Created a `ViroGlobal.ts` utility to provide type-safe access to the global NativeViro object
- Updated all components to use this utility instead of directly accessing global.NativeViro:
  - Viro3DObject.tsx
  - ViroAnimations.ts
  - ViroARTrackingTargets.ts
  - ViroMaterials.ts
  - Viro360Image.tsx
  - Viro360Video.tsx
  - ViroAnimatedComponent.tsx
  - ViroARCamera.tsx
  - ViroARImageMarker.tsx
  - ViroARObjectMarker.tsx
  - ViroARPlane.tsx
  - ViroARScene.tsx
  - ViroARSceneNavigator.tsx
  - ViroAnimatedImage.tsx
  - ViroButton.tsx
  - ViroBox.tsx
  - ViroCamera.tsx
  - ViroController.tsx
  - ViroDirectionalLight.tsx
  - ViroFlexView.tsx
  - ViroGeometry.tsx
  - ViroImage.tsx
  - ViroLightingEnvironment.tsx
  - ViroMaterialVideo.tsx
  - ViroNode.tsx
  - ViroOmniLight.tsx
  - ViroOrbitCamera.tsx
  - ViroParticleEmitter.tsx
  - ViroPolygon.tsx
  - ViroPolyline.tsx
  - ViroPortal.tsx
  - ViroPortalScene.tsx
  - ViroQuad.tsx
  - ViroScene.tsx
  - ViroSceneNavigator.tsx
  - ViroSkyBox.tsx
  - ViroSound.tsx
  - ViroSoundField.tsx
  - ViroSpatialSound.tsx
  - ViroSphere.tsx
  - ViroSpinner.tsx
  - ViroSpotLight.tsx
  - ViroSurface.tsx
  - ViroText.tsx
  - ViroVideo.tsx
  - ViroVRSceneNavigator.tsx

### 2. Fabric Interop Layer

We already have a Fabric Interop Layer that provides compatibility between React Native's New Architecture (Fabric) and the existing Viro implementation without requiring codegen. This layer consists of:

1. **JavaScript Components**: React components that maintain the same API as the original Viro components but use the interop layer internally.
2. **Native Container**: A Fabric-compatible native component that hosts the Viro rendering engine.
3. **JSI Bridge**: Direct communication between JavaScript and native code using JSI, bypassing the React Native bridge.

## Next Steps

### 1. TypeScript Updates (Completed)

✅ Updated all components to use the ViroGlobal utility
✅ Resolved all TypeScript errors
✅ Successfully built the project with the new changes

### 2. Integrate with Existing Fabric Interop Layer

- Ensure the TypeScript improvements work seamlessly with the existing Fabric Interop Layer
- Verify that the ViroGlobal utility correctly interfaces with the JSI bridge in the interop layer

### 3. Testing

- Test the library with both old and new architectures using the Fabric Interop Layer
- Verify that all functionality works correctly
- Address any issues that arise during testing

### 4. Documentation

- Update the documentation to reflect the changes made
- Provide examples of how to use the library with the New Architecture
- Document any breaking changes or migration steps

## Implementation Strategy

Our strategy for supporting the New Architecture is to:

1. Keep most of the existing native code intact
2. Leverage our existing Fabric Interop Layer that already provides:
   - JSI bridge for direct communication without using the React Native bridge
   - Fabric-compatible native container for the Viro rendering engine
   - JavaScript components with the same API as original Viro components
3. Support both old and new architectures simultaneously
4. Gradually migrate to the New Architecture over time

This approach allows us to support the New Architecture without a complete rewrite of the Viro library, which is not feasible given the size of the codebase.

## Resources

- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [JSI Documentation](https://reactnative.dev/docs/the-new-architecture/jsi)
- [Fabric Components](https://reactnative.dev/docs/the-new-architecture/fabric-components)
- [TurboModules](https://reactnative.dev/docs/the-new-architecture/turbomodules)
