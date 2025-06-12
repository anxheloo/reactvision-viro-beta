cmake_minimum_required(VERSION 3.4.1)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set NODE_MODULES_DIR if not already set
if(NOT NODE_MODULES_DIR)
    # Try to find the node_modules directory by looking up from the current directory
    # This is more robust when the library is used as a dependency in another project
    
    # First, try to find node_modules in the project root (when developing the library)
    set(POTENTIAL_NODE_MODULES_DIR "${CMAKE_SOURCE_DIR}/../../../../node_modules")
    if(EXISTS "${POTENTIAL_NODE_MODULES_DIR}/react-native")
        set(NODE_MODULES_DIR "${POTENTIAL_NODE_MODULES_DIR}")
        message(STATUS "Found React Native in project node_modules: ${NODE_MODULES_DIR}")
    else()
        # When used as a dependency in another project, try to find node_modules in the parent directories
        # This handles the case when the library is installed as a node package
        set(POTENTIAL_NODE_MODULES_DIR "${CMAKE_SOURCE_DIR}/../../../../../../../node_modules")
        if(EXISTS "${POTENTIAL_NODE_MODULES_DIR}/react-native")
            set(NODE_MODULES_DIR "${POTENTIAL_NODE_MODULES_DIR}")
            message(STATUS "Found React Native in parent node_modules: ${NODE_MODULES_DIR}")
        else()
            # If we still can't find it, try one more level up (for monorepo structures)
            set(POTENTIAL_NODE_MODULES_DIR "${CMAKE_SOURCE_DIR}/../../../../../../../../node_modules")
            if(EXISTS "${POTENTIAL_NODE_MODULES_DIR}/react-native")
                set(NODE_MODULES_DIR "${POTENTIAL_NODE_MODULES_DIR}")
                message(STATUS "Found React Native in grandparent node_modules: ${NODE_MODULES_DIR}")
            else()
                message(FATAL_ERROR "Could not find React Native in any node_modules directory. Please specify NODE_MODULES_DIR manually.")
            endif()
        endif()
    endif()
    
    message(STATUS "Using NODE_MODULES_DIR: ${NODE_MODULES_DIR}")
endif()

# Check if the React Native directory exists (final verification)
if(NOT EXISTS "${NODE_MODULES_DIR}/react-native")
    message(FATAL_ERROR "React Native directory not found at ${NODE_MODULES_DIR}/react-native")
endif()

# Direct inclusion of React Native headers instead of using find_package
# This is more reliable across different React Native versions and setups

# Add React Native directories to include path
include_directories(
    # JSI and core headers
    "${NODE_MODULES_DIR}/react-native/ReactCommon"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/runtimeexecutor"
    
    # Android-specific headers
    "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/jni"
    "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/first-party/fbjni/headers"
    
    # New Architecture headers
    "${NODE_MODULES_DIR}/react-native/ReactCommon/react/renderer/components/view"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/react/renderer/core"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/react/renderer/graphics"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/react/renderer/debug"
    "${NODE_MODULES_DIR}/react-native/ReactCommon/yoga"
)

# Find required libraries
find_library(FBJNI_LIB fbjni PATHS ${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/first-party/fbjni/jni)
find_library(REACT_NATIVE_JNI reactnativejni PATHS ${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/jni)
find_library(JSI_LIB jsi PATHS ${NODE_MODULES_DIR}/react-native/ReactAndroid/build/intermediates/library_jni/debug/jni)

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
    # Link directly against Android libraries
    android
    ${log-lib}
    
    # If the specific libraries were found, link against them
    # Otherwise, we'll rely on the Android build system to find them
    $<$<BOOL:${FBJNI_LIB}>:${FBJNI_LIB}>
    $<$<BOOL:${REACT_NATIVE_JNI}>:${REACT_NATIVE_JNI}>
    $<$<BOOL:${JSI_LIB}>:${JSI_LIB}>
)
