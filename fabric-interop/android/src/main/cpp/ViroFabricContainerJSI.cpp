// Use the Prefab-provided headers
#include <fbjni/fbjni.h>
#include <jsi/jsi.h>
#include <react/jni/ReadableNativeMap.h>
#include <react/jni/WritableNativeMap.h>
#include <react/jni/JMessageQueueThread.h>
#include <react/jni/NativeMap.h>
#include <react/nativemodule/core/ReactCommon/CallInvokerHolder.h>
#include <android/log.h>

using namespace facebook::jni;
using namespace facebook::jsi;
using namespace facebook::react;

class ViroFabricContainerJSI : public facebook::jni::HybridClass<ViroFabricContainerJSI> {
public:
    static constexpr auto kJavaDescriptor = "Lcom/viromedia/bridge/fabric/ViroFabricContainer;";

    static void registerNatives() {
        registerHybridClass({
            makeNativeMethod("initHybrid", ViroFabricContainerJSI::initHybrid),
        });
    }

    ViroFabricContainerJSI(
        jni::alias_ref<ViroFabricContainerJSI::javaobject> jThis,
        jsi::Runtime* runtime,
        std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker)
        : javaPart_(jni::make_global(jThis)),
          runtime_(runtime),
          jsCallInvoker_(std::move(jsCallInvoker)) {}

private:
    friend HybridBase;

    static void initHybrid(
        jni::alias_ref<ViroFabricContainerJSI::javaobject> jThis) {
        // Get the current ReactContext
        auto reactContextClass = jni::findClassLocal("com/facebook/react/bridge/ReactContext");
        auto reactApplicationContextClass = jni::findClassLocal("com/facebook/react/bridge/ReactApplicationContext");
        
        // Get the current instance manager
        auto reactInstanceManagerClass = jni::findClassLocal("com/facebook/react/ReactInstanceManager");
        auto getCurrentReactContextMethod = reactInstanceManagerClass->getStaticMethod<jobject()>("getCurrentReactContext");
        auto reactContext = getCurrentReactContextMethod();
        
        if (reactContext == nullptr) {
            __android_log_print(ANDROID_LOG_ERROR, "ViroFabricJSI", "React context is null");
            return;
        }
        
        // For React Native 0.76.9+, we need to get the runtime from the RuntimeExecutor
        auto runtimeExecutorHolderClass = jni::findClassLocal("com/facebook/react/bridge/RuntimeExecutor$RuntimeExecutorHolder");
        auto getRuntimeExecutorHolderMethod = reactContextClass->getMethod<jobject()>("getRuntimeExecutorHolder");
        auto runtimeExecutorHolder = getRuntimeExecutorHolderMethod(reactContext);
        
        if (runtimeExecutorHolder == nullptr) {
            __android_log_print(ANDROID_LOG_ERROR, "ViroFabricJSI", "RuntimeExecutorHolder is null");
            return;
        }
        
        // Get the runtime from the RuntimeExecutorHolder
        auto getRuntimeMethod = runtimeExecutorHolderClass->getMethod<jlong()>("get");
        auto runtimePointer = getRuntimeMethod(runtimeExecutorHolder);
        
        if (runtimePointer == 0) {
            __android_log_print(ANDROID_LOG_ERROR, "ViroFabricJSI", "Runtime pointer is null");
            return;
        }
        
        auto runtime = reinterpret_cast<jsi::Runtime*>(runtimePointer);
        
        // Get the JS call invoker
        auto jsCallInvokerHolderClass = jni::findClassLocal("com/facebook/react/turbomodule/core/CallInvokerHolderImpl");
        auto getJSCallInvokerHolderMethod = reactContextClass->getMethod<jobject()>("getJSCallInvokerHolder");
        auto jsCallInvokerHolder = getJSCallInvokerHolderMethod(reactContext);
        
        if (jsCallInvokerHolder == nullptr) {
            __android_log_print(ANDROID_LOG_ERROR, "ViroFabricJSI", "JSCallInvokerHolder is null");
            return;
        }
        
        auto getCallInvokerMethod = jsCallInvokerHolderClass->getMethod<jlong()>("getCallInvoker");
        auto callInvokerPointer = getCallInvokerMethod(jsCallInvokerHolder);
        
        if (callInvokerPointer == 0) {
            __android_log_print(ANDROID_LOG_ERROR, "ViroFabricJSI", "CallInvoker pointer is null");
            return;
        }
        
        auto callInvoker = reinterpret_cast<facebook::react::CallInvoker*>(callInvokerPointer);
        auto jsCallInvoker = std::shared_ptr<facebook::react::CallInvoker>(callInvoker, [](facebook::react::CallInvoker*) {
            // No-op deleter since we don't own the CallInvoker
        });
        
        // Create the C++ instance
        auto instance = std::make_shared<ViroFabricContainerJSI>(jThis, runtime, jsCallInvoker);
        
        // Install JSI bindings
        instance->installJSIBindings();
        
        // Store the instance
        jThis->cthis()->javaPart_ = jni::make_global(jThis);
    }

    void installJSIBindings() {
        if (!runtime_) {
            return;
        }
        
        auto& runtime = *runtime_;
        
        // Create the NativeViro object
        auto nativeViro = jsi::Object(runtime);
        
        // Node management functions
        nativeViro.setProperty(runtime, "createViroNode", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "createViroNode"),
            3,  // nodeId, nodeType, props
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 3) {
                    throw jsi::JSError(rt, "createViroNode requires 3 arguments");
                }
                
                auto nodeId = args[0].getString(rt).utf8(rt);
                auto nodeType = args[1].getString(rt).utf8(rt);
                
                // Convert props from JSI to ReadableMap
                auto propsValue = args[2];
                auto propsObj = propsValue.getObject(rt);
                auto propsMap = jni::make_local(ReadableNativeMap::createWithContents(rt, std::move(propsObj)));
                
                // Call the Java method
                static const auto createNodeMethod = 
                    javaPart_->getClass()->getMethod<void(jstring, jstring, ReadableNativeMap::javaobject)>("createNode");
                createNodeMethod(
                    javaPart_.get(),
                    jni::make_jstring(nodeId).get(),
                    jni::make_jstring(nodeType).get(),
                    propsMap.get());
                
                return jsi::Value::undefined();
            }
        ));
        
        nativeViro.setProperty(runtime, "updateViroNode", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "updateViroNode"),
            2,  // nodeId, props
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 2) {
                    throw jsi::JSError(rt, "updateViroNode requires 2 arguments");
                }
                
                auto nodeId = args[0].getString(rt).utf8(rt);
                
                // Convert props from JSI to ReadableMap
                auto propsValue = args[1];
                auto propsObj = propsValue.getObject(rt);
                auto propsMap = jni::make_local(ReadableNativeMap::createWithContents(rt, std::move(propsObj)));
                
                // Call the Java method
                static const auto updateNodeMethod = 
                    javaPart_->getClass()->getMethod<void(jstring, ReadableNativeMap::javaobject)>("updateNode");
                updateNodeMethod(
                    javaPart_.get(),
                    jni::make_jstring(nodeId).get(),
                    propsMap.get());
                
                return jsi::Value::undefined();
            }
        ));
        
        nativeViro.setProperty(runtime, "deleteViroNode", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "deleteViroNode"),
            1,  // nodeId
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 1) {
                    throw jsi::JSError(rt, "deleteViroNode requires 1 argument");
                }
                
                auto nodeId = args[0].getString(rt).utf8(rt);
                
                // Call the Java method
                static const auto deleteNodeMethod = 
                    javaPart_->getClass()->getMethod<void(jstring)>("deleteNode");
                deleteNodeMethod(
                    javaPart_.get(),
                    jni::make_jstring(nodeId).get());
                
                return jsi::Value::undefined();
            }
        ));
        
        // Scene hierarchy functions
        nativeViro.setProperty(runtime, "addViroNodeChild", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "addViroNodeChild"),
            2,  // parentId, childId
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 2) {
                    throw jsi::JSError(rt, "addViroNodeChild requires 2 arguments");
                }
                
                auto parentId = args[0].getString(rt).utf8(rt);
                auto childId = args[1].getString(rt).utf8(rt);
                
                // Call the Java method
                static const auto addChildMethod = 
                    javaPart_->getClass()->getMethod<void(jstring, jstring)>("addChild");
                addChildMethod(
                    javaPart_.get(),
                    jni::make_jstring(childId).get(),
                    jni::make_jstring(parentId).get());
                
                return jsi::Value::undefined();
            }
        ));
        
        nativeViro.setProperty(runtime, "removeViroNodeChild", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "removeViroNodeChild"),
            2,  // parentId, childId
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 2) {
                    throw jsi::JSError(rt, "removeViroNodeChild requires 2 arguments");
                }
                
                auto parentId = args[0].getString(rt).utf8(rt);
                auto childId = args[1].getString(rt).utf8(rt);
                
                // Call the Java method
                static const auto removeChildMethod = 
                    javaPart_->getClass()->getMethod<void(jstring, jstring)>("removeChild");
                removeChildMethod(
                    javaPart_.get(),
                    jni::make_jstring(childId).get(),
                    jni::make_jstring(parentId).get());
                
                return jsi::Value::undefined();
            }
        ));
        
        // Event handling functions
        nativeViro.setProperty(runtime, "registerEventCallback", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "registerEventCallback"),
            3,  // nodeId, eventName, callbackId
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 3) {
                    throw jsi::JSError(rt, "registerEventCallback requires 3 arguments");
                }
                
                auto nodeId = args[0].getString(rt).utf8(rt);
                auto eventName = args[1].getString(rt).utf8(rt);
                auto callbackId = args[2].getString(rt).utf8(rt);
                
                // Call the Java method
                static const auto registerEventCallbackMethod = 
                    javaPart_->getClass()->getMethod<void(jstring, jstring, jstring)>("registerEventCallback");
                registerEventCallbackMethod(
                    javaPart_.get(),
                    jni::make_jstring(callbackId).get(),
                    jni::make_jstring(eventName).get(),
                    jni::make_jstring(nodeId).get());
                
                return jsi::Value::undefined();
            }
        ));
        
        nativeViro.setProperty(runtime, "unregisterEventCallback", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "unregisterEventCallback"),
            3,  // nodeId, eventName, callbackId
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 3) {
                    throw jsi::JSError(rt, "unregisterEventCallback requires 3 arguments");
                }
                
                auto nodeId = args[0].getString(rt).utf8(rt);
                auto eventName = args[1].getString(rt).utf8(rt);
                auto callbackId = args[2].getString(rt).utf8(rt);
                
                // Call the Java method
                static const auto unregisterEventCallbackMethod = 
                    javaPart_->getClass()->getMethod<void(jstring, jstring, jstring)>("unregisterEventCallback");
                unregisterEventCallbackMethod(
                    javaPart_.get(),
                    jni::make_jstring(callbackId).get(),
                    jni::make_jstring(eventName).get(),
                    jni::make_jstring(nodeId).get());
                
                return jsi::Value::undefined();
            }
        ));
        
        // Initialize function
        nativeViro.setProperty(runtime, "initialize", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "initialize"),
            1,  // apiKey
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 1) {
                    throw jsi::JSError(rt, "initialize requires 1 argument");
                }
                
                auto apiKey = args[0].getString(rt).utf8(rt);
                
                // Initialize Viro (this is a placeholder - actual initialization happens in the initialize method)
                
                // Return a promise that resolves to true using Promise.resolve()
                auto promiseConstructor = rt.global().getPropertyAsObject(rt, "Promise");
                auto resolveMethod = promiseConstructor.getPropertyAsFunction(rt, "resolve");
                auto promise = resolveMethod.callWithThis(rt, promiseConstructor, jsi::Value(true));
                
                return promise;
            }
        ));
        
        // Attach the NativeViro object to the global object
        runtime.global().setProperty(runtime, "NativeViro", std::move(nativeViro));
        
        // Add a function to handle events from native code
        runtime.global().setProperty(runtime, "handleViroEvent", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "handleViroEvent"),
            2,  // callbackId, event
            [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 2) {
                    return jsi::Value::undefined();
                }
                
                auto callbackId = args[0].getString(rt);
                auto event = args[1];
                
                // Use the jsCallInvoker to ensure we're on the JS thread
                jsCallInvoker_->invokeAsync([callbackIdCopy = std::string(callbackId.utf8(rt)), &rt, event]() {
                    // Find the callback in the global registry
                    auto callbackRegistry = rt.global().getProperty(rt, "eventCallbacks");
                    if (!callbackRegistry.isObject()) {
                        // Create the callback registry if it doesn't exist
                        auto newRegistry = jsi::Object(rt);
                        rt.global().setProperty(rt, "eventCallbacks", newRegistry);
                        return;
                    }
                    
                    auto callbackRegistryObj = callbackRegistry.getObject(rt);
                    auto callback = callbackRegistryObj.getProperty(rt, callbackIdCopy.c_str());
                    
                    if (!callback.isObject() || !callback.getObject(rt).isFunction(rt)) {
                        return;
                    }
                    
                    // Call the callback with the event
                    auto callbackFunc = callback.getObject(rt).getFunction(rt);
                    callbackFunc.call(rt, event);
                });
                
                return jsi::Value::undefined();
            }
        ));
        
        // Add a method to register event callbacks
        runtime.global().setProperty(runtime, "registerViroEventCallback", jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "registerViroEventCallback"),
            2,  // callbackId, callback
            [](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* args, size_t count) -> jsi::Value {
                if (count < 2) {
                    return jsi::Value::undefined();
                }
                
                auto callbackId = args[0].getString(rt);
                auto callback = args[1];
                
                if (!callback.isObject() || !callback.getObject(rt).isFunction(rt)) {
                    return jsi::Value::undefined();
                }
                
                // Get or create the callback registry
                auto callbackRegistry = rt.global().getProperty(rt, "eventCallbacks");
                jsi::Object callbackRegistryObj(rt);
                
                if (!callbackRegistry.isObject()) {
                    callbackRegistryObj = jsi::Object(rt);
                    rt.global().setProperty(rt, "eventCallbacks", callbackRegistryObj);
                } else {
                    callbackRegistryObj = callbackRegistry.getObject(rt);
                }
                
                // Store the callback in the registry
                callbackRegistryObj.setProperty(rt, callbackId.utf8(rt).c_str(), callback);
                
                return jsi::Value::undefined();
            }
        ));
    }

    jni::global_ref<ViroFabricContainerJSI::javaobject> javaPart_;
    jsi::Runtime* runtime_;
    std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker_;
};

JNIEXPORT jint JNI_OnLoad(JavaVM* vm, void*) {
    return facebook::jni::initialize(vm, [] {
        ViroFabricContainerJSI::registerNatives();
    });
}
