# Viro Fabric Interop Layer for Android

This directory contains the Android implementation of the Viro Fabric interop layer, which enables React Native's New Architecture support for the Viro library.

## Implementation Strategy

Similar to the iOS implementation, the Android implementation uses a bridge approach to connect the New Architecture components to the existing Viro implementation. This approach allows us to leverage the existing Viro native code while benefiting from the performance improvements of the New Architecture.

> **Note**: This library requires React Native's New Architecture to be enabled in your app. Legacy architecture is not supported.

## Key Components

### 1. ViroFabricViewManager

The `ViroFabricViewManager` is responsible for creating and managing the native Viro views. It implements the `ViewManager` interface from React Native and provides the necessary methods to create, update, and destroy Viro views.

### 2. ViroFabricModule

The `ViroFabricModule` provides the JavaScript interface for the native Viro functionality. It implements the `NativeModule` interface from React Native and exposes methods that can be called from JavaScript.

### 3. JSI Integration

The JSI integration provides direct access to native functions from JavaScript. It handles type conversions between JavaScript and native types and supports multiple approaches to get the JSI runtime.

### 4. Event Handling

Events are handled through two mechanisms:

- **Direct JSI Calls**: When the JSI runtime is available, events are dispatched directly through JSI
- **Event Emitter Fallback**: When JSI is not available, events are dispatched through the traditional RCTEventEmitter

## Implementation Steps

### 1. Create the ViroFabricViewManager

```java
@ReactModule(name = ViroFabricViewManager.NAME)
public class ViroFabricViewManager extends ViewManager<ViroFabricView, ViroFabricProps> {
    public static final String NAME = "ViroFabricContainer";

    private final ReactApplicationContext reactContext;

    public ViroFabricViewManager(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public ViroFabricView createViewInstance(ThemedReactContext context) {
        return new ViroFabricView(context);
    }

    @Override
    public void updateProperties(ViroFabricView view, ViroFabricProps props) {
        view.updateProperties(props);
    }

    @ReactProp(name = "arEnabled")
    public void setArEnabled(ViroFabricView view, boolean arEnabled) {
        view.setArEnabled(arEnabled);
    }

    @ReactProp(name = "worldAlignment")
    public void setWorldAlignment(ViroFabricView view, String worldAlignment) {
        view.setWorldAlignment(worldAlignment);
    }

    // Other props...

    @Override
    public void receiveCommand(ViroFabricView view, String commandId, ReadableArray args) {
        switch (commandId) {
            case "initialize":
                view.initialize(
                    args.getString(0), // apiKey
                    args.getBoolean(1), // debug
                    args.getBoolean(2), // arEnabled
                    args.getString(3) // worldAlignment
                );
                break;
            case "cleanup":
                view.cleanup();
                break;
            // Other commands...
        }
    }
}
```

### 2. Create the ViroFabricView

```java
public class ViroFabricView extends FrameLayout {
    private ViroView viroView;
    private boolean isAR;
    private final Map<String, Object> nodeRegistry = new HashMap<>();
    private final Map<String, String> eventCallbackRegistry = new HashMap<>();

    public ViroFabricView(Context context) {
        super(context);
    }

    public void initialize(String apiKey, boolean debug, boolean arEnabled, String worldAlignment) {
        cleanup();

        isAR = arEnabled;
        if (arEnabled) {
            // Create AR view
            viroView = new ViroViewARCore(getContext(), new ViroViewARCore.StartupListener() {
                @Override
                public void onSuccess() {
                    dispatchEvent("onInitialized", Arguments.createMap());
                }

                @Override
                public void onFailure(ViroViewARCore.StartupError error, String errorMessage) {
                    WritableMap event = Arguments.createMap();
                    event.putString("error", errorMessage);
                    dispatchEvent("onARSessionFailed", event);
                }
            });

            // Set world alignment
            if (worldAlignment != null) {
                switch (worldAlignment) {
                    case "GravityAndHeading":
                        ((ViroViewARCore) viroView).setWorldAlignment(WorldAlignment.GRAVITY_AND_HEADING);
                        break;
                    case "Camera":
                        ((ViroViewARCore) viroView).setWorldAlignment(WorldAlignment.CAMERA);
                        break;
                    default:
                        ((ViroViewARCore) viroView).setWorldAlignment(WorldAlignment.GRAVITY);
                        break;
                }
            }
        } else {
            // Create regular view
            viroView = new ViroView(getContext(), new ViroView.StartupListener() {
                @Override
                public void onSuccess() {
                    dispatchEvent("onInitialized", Arguments.createMap());
                }

                @Override
                public void onFailure(ViroView.StartupError error, String errorMessage) {
                    WritableMap event = Arguments.createMap();
                    event.putString("error", errorMessage);
                    dispatchEvent("onInitializationFailed", event);
                }
            });
        }

        addView(viroView);
    }

    public void cleanup() {
        if (viroView != null) {
            removeView(viroView);
            viroView.destroy();
            viroView = null;
        }

        nodeRegistry.clear();
        eventCallbackRegistry.clear();
        isAR = false;
    }

    // Other methods for node management, event handling, etc.

    private void dispatchEvent(String eventName, WritableMap params) {
        // Dispatch event to JS
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
            getId(),
            eventName,
            params
        );
    }
}
```

### 3. Implement JSI Integration

```java
public class ViroJSIModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private final HybridData mHybridData;

    static {
        System.loadLibrary("viro_jsi");
    }

    public ViroJSIModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        mHybridData = initHybrid(reactContext);
    }

    private native HybridData initHybrid(ReactApplicationContext reactContext);
    private native void installJSIBindings();

    @Override
    public String getName() {
        return "ViroJSI";
    }

    @Override
    public void initialize() {
        super.initialize();
        installJSIBindings();
    }
}
```

### 4. Create the C++ Implementation for JSI

```cpp
#include <fbjni/fbjni.h>
#include <jsi/jsi.h>
#include <ReactCommon/CallInvoker.h>
#include <ReactCommon/TurboModuleUtils.h>

using namespace facebook::jsi;
using namespace facebook::jni;

class ViroJSIModule : public jni::HybridClass<ViroJSIModule> {
public:
    static constexpr auto kJavaDescriptor = "Lcom/viro/react/ViroJSIModule;";

    static jni::local_ref<jhybriddata> initHybrid(
        jni::alias_ref<jhybridobject> jThis,
        jni::alias_ref<ReactContextBaseJavaModule::javaobject> reactContext) {
        return makeCxxInstance(jThis, reactContext);
    }

    ViroJSIModule(
        jni::alias_ref<jhybridobject> jThis,
        jni::alias_ref<ReactContextBaseJavaModule::javaobject> reactContext)
        : javaPart_(jThis), reactContext_(reactContext) {}

    void installJSIBindings() {
        auto reactContext = reactContext_.get();
        auto jsContext = reactContext->getJavaScriptContextHolder();
        auto runtime = static_cast<Runtime*>(jsContext->get());

        if (runtime == nullptr) {
            return;
        }

        auto& rt = *runtime;
        auto nativeViro = Object(rt);

        // Add functions to nativeViro object
        nativeViro.setProperty(rt, "createViroNode", Function::createFromHostFunction(
            rt,
            PropNameID::forAscii(rt, "createViroNode"),
            3,  // nodeId, nodeType, props
            [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
                // Implementation
                return Value::undefined();
            }
        ));

        // Add more functions...

        // Attach nativeViro to global object
        rt.global().setProperty(rt, "NativeViro", std::move(nativeViro));
    }

private:
    jni::alias_ref<jhybridobject> javaPart_;
    jni::alias_ref<ReactContextBaseJavaModule::javaobject> reactContext_;
};

extern "C" JNIEXPORT jint JNI_OnLoad(JavaVM* vm, void*) {
    return facebook::jni::initialize(vm, [] {
        ViroJSIModule::registerNatives();
    });
}
```

## Usage in JavaScript

The usage in JavaScript is the same as for iOS:

```jsx
import { ViroFabricContainer } from "@reactvision/react-viro/fabric";

function MyARApp() {
  return (
    <ViroFabricContainer
      arEnabled={true}
      worldAlignment="Gravity"
      onInitialized={handleInitialized}
    >
      {/* Your AR content here */}
    </ViroFabricContainer>
  );
}
```

## Building and Testing

To build and test the Android implementation:

1. Make sure you have the Android SDK and NDK installed
2. Run `./gradlew assembleDebug` to build the debug version
3. Run `./gradlew connectedAndroidTest` to run the tests on a connected device

## Future Improvements

1. **Full TurboModule Implementation**: Enhance the current bridge approach with more TurboModule features
2. **Performance Optimizations**: Further optimize the JSI integration for better performance
3. **Enhanced Type Safety**: Improve type safety through TypeScript and C++ type checking

## Important Note on Codegen

This implementation deliberately avoids using React Native's codegen system. Instead, we use direct JSI bindings to communicate between JavaScript and native code. This approach has several advantages:

1. **Independence from Codegen**: We don't rely on React Native's codegen toolchain, which can change between versions
2. **Full Control**: We have complete control over the API surface and implementation details
3. **Simplified Maintenance**: The bridge code is centralized and focused, making it easier to maintain
4. **Future-Proof**: This approach will continue to work as React Native evolves, without requiring updates to codegen specs
