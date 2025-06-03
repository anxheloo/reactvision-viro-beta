# Supporting React Native New Architecture in Viro

This document outlines how the Viro library supports React Native's New Architecture using our Fabric Interop Layer.

## Understanding the Challenge

The Viro library has a large native codebase for both Android and iOS platforms. The React Native New Architecture introduces several changes:

1. **Fabric**: A new rendering system that improves interoperability between React Native and host platform UI components.
2. **TurboModules**: A new way to call native methods from JavaScript with type safety.
3. **Codegen**: A tool that generates C++ code from JavaScript specifications.

The main concern is that using Codegen might require a significant rewrite of the existing native code, which is not feasible given the size of the Viro codebase.

## Our Solution: Fabric Interop Layer

Instead of completely rewriting the native code to use Codegen, we've implemented a Fabric Interop Layer that provides compatibility between React Native's New Architecture and the existing Viro implementation without requiring codegen. This approach allows us to:

1. Keep most of the existing native code intact
2. Support the New Architecture without a complete rewrite

### Components of the Fabric Interop Layer

Our Fabric Interop Layer consists of:

1. **JavaScript Components**: React components that maintain the same API as the original Viro components but use the interop layer internally.
2. **Native Container**: A Fabric-compatible native component that hosts the Viro rendering engine.
3. **JSI Bridge**: Direct communication between JavaScript and native code using JSI, bypassing the React Native bridge.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  JS Components  │────▶│    JSI Bridge   │────▶│  Existing Viro  │
│                 │     │                 │     │  Implementation │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### TypeScript Improvements

To further enhance the interoperability with the New Architecture, we've made the following TypeScript improvements:

- Created a `ViroGlobal.ts` utility to provide type-safe access to the global NativeViro object
- Updated all components to use this utility instead of directly accessing global.NativeViro
- Fixed TypeScript errors by properly declaring the global NativeViro object
- Successfully built the project without TypeScript errors

### How It Works

1. **JS Components**: When you use a component like `<ViroBox>`, it creates a virtual node in the native implementation through JSI.
2. **JSI Bridge**: Direct function calls between JavaScript and native code, with no serialization overhead.
3. **Native Implementation**: The existing Viro native code is reused, with minimal changes to work with the interop layer.

## Usage

The Fabric Interop Layer provides the same API as the original Viro library, so you can use all the same components and features:

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

## Next Steps

To complete the implementation, we need to:

1. ✅ Update all components to use the ViroGlobal utility
2. ✅ Ensure proper integration with the existing Fabric Interop Layer
3. ✅ Test the library with both old and new architectures
4. Update documentation and provide examples for using the library with the New Architecture

## Conclusion

By leveraging our existing Fabric Interop Layer, we can support the React Native New Architecture without a complete rewrite of the Viro library. This approach provides a pragmatic path forward that balances the benefits of the New Architecture with the practical constraints of maintaining a large existing codebase.

## References

- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
