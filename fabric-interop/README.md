# Viro React Native Fabric Interop Layer

This directory contains the Fabric interop layer for Viro React Native, which enables support for React Native's New Architecture.

## Overview

The Fabric interop layer provides a bridge between the existing Viro React Native implementation and React Native's New Architecture (Fabric). It allows you to use Viro components in apps that have enabled the New Architecture.

## Installation

### iOS

To use the Fabric interop layer in your iOS app, you need to add the `ViroFabric` pod to your Podfile:

```ruby
# Add Viro React Native
# IMPORTANT: Order matters! ViroKit must be included before ViroFabric
pod 'ViroReact', :path => '../node_modules/@reactvision/react-viro/ios'
pod 'ViroKit', :path => '../node_modules/@reactvision/react-viro/ios/dist/ViroRenderer/'

# Add Viro Fabric components for New Architecture support
# This is only needed if you're using the New Architecture
# IMPORTANT: You must explicitly specify the path to the ViroFabric podspec
if flags[:fabric_enabled]
  pod 'ViroFabric', :path => '../node_modules/@reactvision/react-viro/fabric-interop/ios'
end
```

> **Note:** There are two important requirements for the Podfile:
>
> 1. You must explicitly specify the path to the ViroFabric podspec as shown above. The ViroReact pod does not automatically include the ViroFabric pod.
> 2. The order of the pods matters. ViroKit must be included before ViroFabric, as ViroFabric depends on ViroKit's headers.

### Android

For Android, you need to ensure the Fabric interop layer is included in your project. If you're using the Expo plugin, this is handled automatically when the New Architecture is enabled.

If you're manually configuring your Android project, you need to:

1. Add the Fabric interop module to your `settings.gradle`:

```gradle
include ':fabric-interop'
project(':fabric-interop').projectDir = new File('../node_modules/@reactvision/react-viro/fabric-interop/android')
```

2. Add the dependency to your app's `build.gradle`:

```gradle
// Only add this if New Architecture is enabled
implementation project(path: ':fabric-interop')
```

3. Make sure your app has the New Architecture enabled by setting `newArchEnabled=true` in your `gradle.properties` file.

## Usage

When using the New Architecture, you should import components from the `@reactvision/react-viro/fabric` path instead of directly from `@reactvision/react-viro`:

```javascript
// Old way (still works for legacy architecture)
import { ViroARSceneNavigator } from "@reactvision/react-viro";

// New way (works with both legacy and new architectures)
import { ViroARSceneNavigator } from "@reactvision/react-viro/fabric";
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
2. You're importing Viro headers using angle brackets with the ViroReact prefix, like this:
   ```objc
   #import <ViroReact/VRTSceneNavigator.h>
   #import <ViroReact/VRTARSceneNavigator.h>
   ```
3. The order of pods in your Podfile is correct (ViroKit before ViroFabric)
4. You've run `pod install` after making any changes to your Podfile

### Other Issues

If you encounter other issues with the Fabric interop layer, please check:

1. Your React Native version is compatible (requires RN 0.70.0 or higher)
2. You have properly enabled the New Architecture in your app
3. All dependencies are up to date

## Contributing

If you'd like to contribute to the Fabric interop layer, please submit a pull request or open an issue on GitHub.
