cmake_minimum_required(VERSION 3.4.1)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find the React Native directory
find_package(ReactAndroid REQUIRED CONFIG)

# Add the JSI directory
include_directories(
    "${NODE_MODULES_DIR}/react-native/ReactCommon"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
    "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/jni"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core"
)

# Add the fbjni directory
include_directories(
    "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/first-party/fbjni/headers"
)

# Add the source files
add_library(
    viro-fabric-jsi
    SHARED
    ViroFabricContainerJSI.cpp
)

# Link against the required libraries
target_link_libraries(
    viro-fabric-jsi
    ReactAndroid::jsi
    ReactAndroid::react_nativemodule_core
    ReactAndroid::fbjni
    android
    log
)
