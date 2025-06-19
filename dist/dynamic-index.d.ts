/**
 * Viro React Native - Dynamic Architecture Detection
 *
 * This entry point automatically detects whether the app is using
 * React Native's New Architecture (Fabric) or the legacy architecture,
 * and exports the appropriate implementation.
 */
declare global {
    var nativeFabricUIManager: any;
    var __turboModuleProxy: any;
}
export {};
