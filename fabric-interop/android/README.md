# Viro Fabric Interop - Android

This module provides interoperability between React Native's Fabric architecture and Viro components.

## Dependencies

This module depends on:

1. React Native with New Architecture enabled
2. Viro Bridge module
3. Viro Renderer module

## Building

### As part of the main app

When building as part of the main app, this module is included in the app's `settings.gradle`:

```gradle
// In android/settings.gradle
include ':fabric-interop'
project(':fabric-interop').projectDir = new File(rootProject.projectDir, '../fabric-interop/android')
```

The module uses `compileOnly` dependencies for the Viro modules, which means they are expected to be provided by the main app at runtime.

### Standalone

When building standalone, the module uses its own `settings.gradle` file to locate the Viro modules. It looks for them in the `../../android` directory relative to the module's directory.

## Troubleshooting

### Missing dependencies

If you encounter errors like:

```
Could not find com.facebook.react:fbjni:+
```

or

```
Project with path ':react_viro' could not be found in project ':fabric-interop'
```

This is because the module is trying to resolve dependencies that should be provided by the main app. Make sure:

1. The main app includes the Viro modules
2. The main app has built the Viro modules at least once (to generate the AAR files)
3. The paths in the `build.gradle` file are correct for your project structure

### C++ compilation errors

If you encounter C++ compilation errors, make sure:

1. The New Architecture is enabled in your app
2. The React Native version is compatible with the module
3. The include paths in `CMakeLists.txt` are correct for your React Native version

## Implementation Details

This module uses:

1. Java/Kotlin code to implement the Fabric component interface
2. C++ code to implement the JSI interface
3. JavaScript/TypeScript code to provide the React component API

The key files are:

- `ViroFabricContainer.java`: The main container view for Viro content
- `ViroFabricContainerJSI.cpp`: The C++ implementation of the JSI interface
- `ViroFabricContainer.tsx`: The TypeScript implementation of the React component
