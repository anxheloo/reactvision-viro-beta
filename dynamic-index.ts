/**
 * Viro React Native - Dynamic Architecture Detection
 *
 * This entry point automatically detects whether the app is using
 * React Native's New Architecture (Fabric) or the legacy architecture,
 * and exports the appropriate implementation.
 */

import { NativeModules } from "react-native";

// Add type declarations for global variables used in New Architecture detection
declare global {
  var nativeFabricUIManager: any;
  var __turboModuleProxy: any;
}

// Detection function
function isNewArchitectureEnabled(): boolean {
  // Primary check: Look for the Fabric UI Manager
  if (global.nativeFabricUIManager) return true;

  // Secondary check: Check for other New Architecture indicators
  // This helps with some edge cases where the first check might not be reliable
  if (NativeModules.PlatformConstants?.reactNativeVersion?.minor >= 70) {
    // RN 0.70+ might have New Architecture
    // You can add more sophisticated detection if needed
    return !!global.__turboModuleProxy;
  }

  return false;
}

// Dynamic export based on architecture
if (isNewArchitectureEnabled()) {
  console.log("ViroReact: Using New Architecture (Fabric) components");
  module.exports = require("./fabric-interop");
} else {
  console.warn(
    "ViroReact: Using legacy architecture components. " +
      "This mode is deprecated and will be removed in version 3.0.0. " +
      "Please enable the New Architecture in your app for better performance and future compatibility."
  );
  // Export legacy components
  module.exports = require("./index");
}
