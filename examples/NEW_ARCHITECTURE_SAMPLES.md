# New Architecture Sample Files

This directory contains sample configuration files for using Viro React Native with React Native's New Architecture.

## iOS Configuration

### Podfile

The `SamplePodfile` demonstrates how to configure your iOS project to use Viro React Native with the New Architecture. The key parts are:

1. Including the standard Viro React Native pods:

   ```ruby
   pod 'ViroReact', :path => '../node_modules/@reactvision/react-viro/ios'
   pod 'ViroKit', :path => '../node_modules/@reactvision/react-viro/ios/dist/ViroRenderer/'
   ```

2. Conditionally including the Fabric interop layer when the New Architecture is enabled:
   ```ruby
   if flags[:fabric_enabled]
     pod 'ViroFabric', :path => '../node_modules/@reactvision/react-viro/fabric-interop/ios'
   end
   ```

## Android Configuration

### settings.gradle

The `SampleAndroidSettingsGradle` demonstrates how to configure your Android project's settings.gradle file to include the Viro React Native modules and the Fabric interop layer:

1. Including the standard Viro React Native modules:

   ```gradle
   include ':react_viro', ':arcore_client', ':gvr_common', ':viro_renderer'
   project(':arcore_client').projectDir = new File('../node_modules/@reactvision/react-viro/android/arcore_client')
   project(':gvr_common').projectDir = new File('../node_modules/@reactvision/react-viro/android/gvr_common')
   project(':viro_renderer').projectDir = new File('../node_modules/@reactvision/react-viro/android/viro_renderer')
   project(':react_viro').projectDir = new File('../node_modules/@reactvision/react-viro/android/react_viro')
   ```

2. Including the Fabric interop layer:
   ```gradle
   include ':fabric-interop'
   project(':fabric-interop').projectDir = new File('../node_modules/@reactvision/react-viro/fabric-interop/android')
   ```

### build.gradle

The `SampleAndroidBuildGradle` demonstrates how to configure your Android project's app/build.gradle file to include the Viro React Native dependencies and conditionally include the Fabric interop layer when the New Architecture is enabled:

1. Including the standard Viro React Native dependencies:

   ```gradle
   implementation project(':gvr_common')
   implementation project(':arcore_client')
   implementation project(path: ':react_viro')
   implementation project(path: ':viro_renderer')
   ```

2. Conditionally including the Fabric interop layer when the New Architecture is enabled:
   ```gradle
   if (isNewArchitectureEnabled()) {
       implementation project(path: ':fabric-interop')
   }
   ```

## Usage

To use these sample files:

1. Copy the relevant parts of these files into your project's configuration files.
2. Make sure to adjust the paths if your project structure is different.
3. For iOS, run `pod install` after updating your Podfile.
4. For Android, sync your Gradle files after updating them.

## Enabling the New Architecture

### iOS

To enable the New Architecture in your iOS project, set `fabric_enabled` to `true` in your Podfile:

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :fabric_enabled => true,
  # ...
)
```

### Android

To enable the New Architecture in your Android project, set `newArchEnabled=true` in your `gradle.properties` file:

```
# Use this property to enable or disable the New Architecture.
# This property is new in React Native 0.68.
newArchEnabled=true
```

## Troubleshooting

If you encounter issues with the New Architecture:

1. Make sure you have the correct versions of React Native and Viro React Native.
2. Ensure that the New Architecture is properly enabled in your project.
3. Check that all the required dependencies are included in your project.
4. Clean and rebuild your project after making changes to the configuration files.

For more detailed information, see the [NEW_ARCHITECTURE.md](../NEW_ARCHITECTURE.md) and [fabric-interop/README.md](../fabric-interop/README.md) files.
