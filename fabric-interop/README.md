# Viro Fabric Interop Layer

This module provides compatibility between React Native's New Architecture (Fabric) and the existing Viro implementation without requiring codegen.

## Overview

The Viro Fabric Interop Layer is a bridge that allows the existing Viro native implementation to work with React Native's New Architecture. It consists of:

1. **JavaScript Components**: React components that maintain the same API as the original Viro components but use the interop layer internally.
2. **Native Container**: A Fabric-compatible native component that hosts the Viro rendering engine.
3. **JSI Bridge**: Direct communication between JavaScript and native code using JSI, bypassing the React Native bridge.

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  JS Components  │────▶│    JSI Bridge   │────▶│  Existing Viro  │
│                 │     │                 │     │  Implementation │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **JS Components**: When you use a component like `<ViroBox>`, it creates a virtual node in the native implementation through JSI.
2. **JSI Bridge**: Direct function calls between JavaScript and native code, with no serialization overhead.
3. **Native Implementation**: The existing Viro native code is reused, with minimal changes to work with the interop layer.

## Installation

### 1. Add the Fabric Interop Layer to your project

```bash
# Copy the fabric-interop directory to your project
cp -r fabric-interop/ /path/to/your/project/
```

### 2. Update your iOS project

Add the following files to your Xcode project:

- `fabric-interop/ios/ViroFabricContainer.h`
- `fabric-interop/ios/ViroFabricContainer.mm`
- `fabric-interop/ios/ViroFabricContainerManager.h`
- `fabric-interop/ios/ViroFabricContainerManager.mm`

### 3. Update your Android project

Add the following files to your Android project:

- `fabric-interop/android/src/main/java/com/viromedia/bridge/fabric/ViroFabricContainer.java`
- `fabric-interop/android/src/main/java/com/viromedia/bridge/fabric/ViroFabricContainerManager.java`
- `fabric-interop/android/src/main/cpp/ViroFabricContainerJSI.cpp`
- `fabric-interop/android/src/main/cpp/CMakeLists.txt`

Update your `android/build.gradle` to include the C++ code:

```gradle
android {
    // ...

    externalNativeBuild {
        cmake {
            path "src/main/cpp/CMakeLists.txt"
        }
    }
}
```

## Usage

### Basic Usage

```jsx
import React from "react";
import { ViroARScene, ViroBox, ViroText } from "fabric-interop";

export default function App() {
  return (
    <ViroARSceneNavigator
      initialScene={{
        scene: () => (
          <ViroARScene>
            <ViroBox
              position={[0, 0, -1]}
              scale={[0.1, 0.1, 0.1]}
              materials={["grid"]}
            />
            <ViroText
              text="Hello Viro!"
              position={[0, 0.1, -1]}
              scale={[0.1, 0.1, 0.1]}
              style={{ color: "#ffffff" }}
            />
          </ViroARScene>
        ),
      }}
    />
  );
}
```

### Advanced Usage

The Fabric Interop Layer provides the same API as the original Viro library, so you can use all the same components and features.

## Components

The following components are available:

- `ViroBox`
- `ViroText`
- `ViroScene`
- `ViroARScene`
- `ViroNode`
- `ViroImage`
- `ViroSphere`
- `Viro3DObject`
- `ViroLight`
- And more...

## How to Extend

To add support for more Viro components:

1. Create a new component file in `fabric-interop/components/`
2. Implement the component using the `useViroNode` hook
3. Export the component from `fabric-interop/components/index.ts`

Example:

```tsx
import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroCustomComponentProps extends ViroCommonProps {
  // Custom props
}

export const ViroCustomComponent: React.FC<ViroCustomComponentProps> = (
  props
) => {
  // Convert props
  const nativeProps = {
    ...convertCommonProps(props),
    // Add custom props
  };

  // Create the node
  const nodeId = useViroNode("customComponent", nativeProps, "viro_root_scene");

  // Return null since rendering happens in native code
  return null;
};
```

## Limitations

- This is a compatibility layer, not a full reimplementation of Viro using the New Architecture.
- Some advanced features may not work exactly the same as in the original Viro library.
- Performance may be slightly lower than a full New Architecture implementation.

## License

MIT
