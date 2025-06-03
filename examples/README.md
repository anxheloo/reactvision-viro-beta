# ViroReact Examples

This directory contains example applications that demonstrate how to use ViroReact with different features and configurations.

## AutoDetectionExample

The `AutoDetectionExample.tsx` demonstrates how to use ViroReact with automatic architecture detection. The library will automatically detect whether your app is using the New Architecture (Fabric) and use the appropriate implementation.

### How to Use

1. Create a new React Native project
2. Install ViroReact:
   ```bash
   npm install @reactvision/react-viro
   ```
3. Copy the `AutoDetectionExample.tsx` file to your project
4. Import and use the component in your app:

   ```jsx
   import AutoDetectionExample from "./AutoDetectionExample";

   export default function App() {
     return <AutoDetectionExample />;
   }
   ```

## Notes

- **Important**: The TypeScript errors in the example files are expected when viewing them in this repository. This is because:

  1. The examples are designed to be used in a project that has installed the package from npm
  2. They reference the package as an external dependency (`@reactvision/react-viro`)
  3. In the repository, these imports can't be resolved correctly

  When used in an actual project with the package installed, these errors will not occur.

- The examples assume you have properly set up your React Native project for AR/VR development, including adding the necessary permissions and configurations for camera access.

## Running the Examples

To run these examples:

1. Create a new React Native project
2. Install the ViroReact package:
   ```bash
   npm install @reactvision/react-viro
   ```
3. Copy the example file to your project
4. Uncomment the import from "@reactvision/react-viro" and remove the import from "../"
5. Run your project on a device with AR capabilities
