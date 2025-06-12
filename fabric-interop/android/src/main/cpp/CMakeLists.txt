cmake_minimum_required(VERSION 3.4.1)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set NODE_MODULES_DIR if not already set
if(NOT NODE_MODULES_DIR)
    set(NODE_MODULES_DIR "${CMAKE_SOURCE_DIR}/../../../../node_modules")
    message(STATUS "NODE_MODULES_DIR not provided, using default: ${NODE_MODULES_DIR}")
endif()

# Check if the React Native directory exists
if(NOT EXISTS "${NODE_MODULES_DIR}/react-native")
    message(FATAL_ERROR "React Native directory not found at ${NODE_MODULES_DIR}/react-native")
endif()

# Find the React Native package
find_package(ReactAndroid REQUIRED CONFIG)

# Add the JSI directory
include_directories(
    "${NODE_MODULES_DIR}/react-native/ReactCommon"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
    "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/jni"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/runtimeexecutor"
)

# Add the fbjni directory
include_directories(
    "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/first-party/fbjni/headers"
)

# Add Android log library
find_library(log-lib log)

# Add the source files
add_library(
    viro-fabric-jsi
    SHARED
    ViroFabricContainerJSI.cpp
)

# Define preprocessor macros
target_compile_definitions(viro-fabric-jsi PRIVATE
    REACT_NATIVE_VERSION=0.76.9
    IS_NEW_ARCHITECTURE_ENABLED=1
)

# Link against the required libraries
target_link_libraries(
    viro-fabric-jsi
    ReactAndroid::jsi
    ReactAndroid::react_nativemodule_core
    ReactAndroid::fbjni
    ReactAndroid::runtimeexecutor
    ReactAndroid::callinvoker
    android
    ${log-lib}
)
