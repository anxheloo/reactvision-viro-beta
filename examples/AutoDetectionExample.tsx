/**
 * AutoDetectionExample
 *
 * This example demonstrates how to use ViroReact with automatic architecture detection.
 * The library will automatically detect whether your app is using the New Architecture (Fabric)
 * and use the appropriate implementation.
 */

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// When using this example in a project that has installed the package from npm:
// import {
//   ViroARSceneNavigator,
//   ViroARScene,
//   ViroBox,
//   ViroText,
//   ViroConstants,
//   ViroTrackingStateConstants,
// } from "@reactvision/react-viro";

// For local development within the repository:
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroBox,
  ViroText,
  ViroConstants,
  ViroTrackingStateConstants,
} from "../";

// Define the AR scene component
const ARScene = () => {
  const [text, setText] = React.useState("Initializing AR...");

  // Handle tracking state updates
  const onTrackingUpdated = (state: { state: string; reason?: string }) => {
    if (state.state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("Hello Viro!");
    } else if (state.state === ViroTrackingStateConstants.TRACKING_NONE) {
      setText("Tracking lost. Please point the camera at a flat surface.");
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      {/* A simple 3D box floating 1 meter in front of the user */}
      <ViroBox
        position={[0, 0, -1]}
        scale={[0.1, 0.1, 0.1]}
        materials={["grid"]}
      />

      {/* Text above the box */}
      <ViroText
        text={text}
        position={[0, 0.1, -1]}
        scale={[0.1, 0.1, 0.1]}
        style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}
      />
    </ViroARScene>
  );
};

// Main app component
const AutoDetectionExample = () => {
  const [arStarted, setArStarted] = React.useState(false);

  const startAR = () => {
    setArStarted(true);
  };

  if (arStarted) {
    return (
      <ViroARSceneNavigator
        initialScene={{
          scene: ARScene,
        }}
        style={styles.arView}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ViroReact Auto-Detection Example</Text>
      <Text style={styles.description}>
        This example uses the automatic architecture detection feature. The
        library will automatically use the appropriate implementation based on
        whether your app has the New Architecture enabled.
      </Text>
      <TouchableOpacity style={styles.button} onPress={startAR}>
        <Text style={styles.buttonText}>Start AR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  arView: {
    flex: 1,
  },
});

export default AutoDetectionExample;
