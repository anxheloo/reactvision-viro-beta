# ReactVision Fabric Interop Layer

This directory contains the Fabric interop layer for ReactVision, which enables support for React Native's New Architecture.

## Overview

The Fabric interop layer provides a bridge between the existing ReactVision implementation and React Native's New Architecture (Fabric). It allows you to use Viro components in apps that have enabled the New Architecture.

## How It Works

The Fabric interop layer is designed as a thin wrapper around the existing Viro native implementation, connecting it to React Native's New Architecture without requiring a complete rewrite of the native code. Here's how it works:

### Architecture

The interop layer consists of three main components:

1. **JavaScript Interface (NativeViro.ts)**

   - Defines TypeScript interfaces and function signatures
   - Manages event callback registration and handling
   - Provides utility functions for ID generation and availability checking

2. **iOS Native Implementation (ViroFabricContainer.mm)**

   - Implements a UIView subclass that hosts the existing VRT\* classes
   - Creates JSI bindings to expose native functionality to JavaScript
   - Delegates to the existing Viro implementation for rendering and scene management

3. **Android Native Implementation**
   - Java component (ViroFabricContainer.java) manages the view and VRT objects
   - C++ component (ViroFabricContainerJSI.cpp) provides JSI bindings
   - Connects JavaScript calls to the existing Java implementation

### JSI Integration

The interop layer uses JavaScript Interface (JSI) to communicate directly with native code, bypassing the traditional React Native bridge. This approach:

- Provides synchronous communication between JavaScript and native code
- Eliminates serialization/deserialization overhead
- Aligns with React Native's New Architecture principles

The JSI integration works by:

1. Creating a global `NativeViro` object in the JavaScript runtime
2. Exposing native methods as JavaScript functions
3. Setting up event handling to pass events from native to JavaScript

```javascript
// JavaScript code can call native methods directly
NativeViro.createViroNode(nodeId, nodeType, props);
```

### Node Management

The interop layer manages Viro nodes by:

1. Creating native VRT\* objects based on node type
2. Updating node properties when they change
3. Managing the node hierarchy (parent-child relationships)
4. Handling node deletion and cleanup

For example, when you create a box in JavaScript:

```javascript
const box = <ViroBox position={[0, 0, -1]} />;
```

The interop layer:

1. Generates a unique node ID
2. Calls `NativeViro.createViroNode(nodeId, "box", {position: [0, 0, -1]})`
3. The native side creates a `VRTBox` object with the specified properties
4. The box is added to the scene hierarchy

### Event System

The event system allows bidirectional communication:

1. **JavaScript to Native**: Function calls through the JSI interface
2. **Native to JavaScript**: Events dispatched through callback registration

When you register an event handler in JavaScript:

```javascript
<ViroBox onTap={handleTap} />
```

The interop layer:

1. Generates a unique callback ID
2. Registers the callback in a JavaScript registry
3. Tells the native side to associate this callback ID with tap events on the node
4. When a tap occurs, the native code calls `handleViroEvent(callbackId, eventData)`
5. The JavaScript side looks up the callback and invokes it with the event data

### Reusing Existing Native Code

The key advantage of this approach is that it reuses the existing Viro native implementation:

- **iOS**: Uses existing VRTSceneNavigator, VRTARSceneNavigator, and other VRT\* classes
- **Android**: Uses existing VRTSceneNavigator, VRTARSceneNavigator, VRTVRSceneNavigator, and other VRT\* classes
- **Rendering**: All rendering is handled by the existing Viro renderer

This means that all the complex AR/VR functionality, rendering, physics, etc. don't need to be reimplemented - the interop layer simply provides a new way to access this functionality that's compatible with React Native's New Architecture.

> **Note:** VR functionality is not supported on iOS. The VR feature has been removed from the iOS implementation, but is still available on Android.

## Installation

### iOS

To use the Fabric interop layer in your iOS app, you need to add the `ViroFabric` pod to your Podfile:

```ruby
# Add ReactVision
# IMPORTANT: Order matters! ViroKit must be included before ViroFabric
pod 'ViroReact', :path => '../node_modules/@reactvision/react-viro/ios'
pod 'ViroKit', :path => '../node_modules/@reactvision/react-viro/ios/dist/ViroRenderer/'

# Add Viro Fabric components for New Architecture
# IMPORTANT: You must explicitly specify the path to the ViroFabric podspec
pod 'ViroFabric', :path => '../node_modules/@reactvision/react-viro/fabric-interop/ios'
```

> **Note:** There are two important requirements for the Podfile:
>
> 1. You must explicitly specify the path to the ViroFabric podspec as shown above. The ViroReact pod does not automatically include the ViroFabric pod.
> 2. The order of the pods matters. ViroKit must be included before ViroFabric, as ViroFabric depends on ViroKit's headers.

### Android

For Android, you need to ensure the Fabric interop layer is included in your project. If you're using the Expo plugin, this is handled automatically.

If you're manually configuring your Android project, you need to:

1. Add the Fabric interop module to your `settings.gradle`:

```gradle
include ':fabric-interop'
project(':fabric-interop').projectDir = new File('../node_modules/@reactvision/react-viro/fabric-interop/android')
```

2. Add the dependency to your app's `build.gradle`:

```gradle
implementation project(path: ':fabric-interop')
```

3. Make sure your app has the New Architecture enabled by setting `newArchEnabled=true` in your `gradle.properties` file.

The Fabric interop layer for Android includes a proper Gradle configuration with:

- A `build.gradle` file that defines the module's dependencies and build configuration
- An `AndroidManifest.xml` file
- ProGuard rules for proper code shrinking
- CMake configuration for native code compilation

This ensures that the module can be properly integrated into any Android project that uses Gradle as its build system.

## Usage

Since the New Architecture is now mandatory, you should import components from the `@reactvision/react-viro/fabric` path:

```javascript
import { ViroARSceneNavigator } from "@reactvision/react-viro/fabric";
```

The legacy import path is deprecated and will be removed in a future version:

```javascript
// DEPRECATED - will be removed in a future version
import { ViroARSceneNavigator } from "@reactvision/react-viro";
```

## Troubleshooting

### "ViroFabricContainer is not available" Error

If you see this error, it means the Fabric interop layer is not properly installed or configured. Make sure you:

1. Have added the `ViroFabric` pod to your Podfile (for iOS)
2. Have enabled the New Architecture in your app
3. Have run `pod install` after making changes to your Podfile
4. Have rebuilt your app completely

### Header File Not Found Errors

If you encounter errors like `'ViroKit/ViroKit.h' file not found` or `'VRTManagedAnimation.h' file not found`, it means the header search paths are not properly configured. Make sure:

1. You're using the latest version of the ViroFabric podspec, which includes the correct header search paths
2. For most Viro headers, use angle brackets with the ViroReact prefix:
   ```objc
   #import <ViroReact/VRTSceneNavigator.h>
   #import <ViroReact/VRTARSceneNavigator.h>
   ```
3. For VRTManagedAnimation.h, import it from ViroKit:
   ```objc
   #import <ViroKit/VRTManagedAnimation.h>
   ```
4. The order of pods in your Podfile is critical (ViroKit must be included before ViroFabric):
   ```ruby
   pod 'ViroReact', :path => '../node_modules/@reactvision/react-viro/ios'
   pod 'ViroKit', :path => '../node_modules/@reactvision/react-viro/ios/dist/ViroRenderer/'
   pod 'ViroFabric', :path => '../node_modules/@reactvision/react-viro/fabric-interop/ios'
   ```
5. You've run `pod install` after making any changes to your Podfile

The key point is that VRTManagedAnimation.h is part of the ViroKit framework, not a standalone header. By importing it directly from ViroKit, you ensure that the compiler can find it regardless of where the pod is installed.

### Other Issues

If you encounter other issues with the Fabric interop layer, please check:

1. Your React Native version is compatible (requires RN 0.70.0 or higher)
2. You have properly enabled the New Architecture in your app
3. All dependencies are up to date

## Contributing

If you'd like to contribute to the Fabric interop layer, please submit a pull request or open an issue on GitHub.
