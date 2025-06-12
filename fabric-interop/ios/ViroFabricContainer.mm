//
//  ViroFabricContainer.mm
//  ViroReact
//
//  Created for ReactVision.
//  Copyright © 2025 ReactVision. All rights reserved.
//

#import "ViroFabricContainer.h"
#import "ViroFabricManager.h"
#import <React/RCTLog.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>
#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModule.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <jsi/jsi.h>

// Import existing Viro headers
#import <ViroReact/VRTSceneNavigator.h>
#import <ViroReact/VRTARSceneNavigator.h>

using namespace facebook::jsi;

@interface ViroFabricContainer () {
    // Reference to the existing Viro navigator
    VRTSceneNavigator *_sceneNavigator;
    VRTARSceneNavigator *_arSceneNavigator;
    
    // JSI runtime
    std::shared_ptr<facebook::jsi::Runtime> _runtime;
    
    // Node registry
    NSMutableDictionary<NSString *, id> *_nodeRegistry;
    
    // Event callback registry
    NSMutableDictionary<NSString *, NSString *> *_eventCallbackRegistry;
    
    // Flag to track if we're using AR
    BOOL _isAR;
    
    // Bridge reference
    __weak RCTBridge *_bridge;
}

@end

@implementation ViroFabricContainer

// Forward declaration of the runtime bridge class
@interface ViroRuntimeBridge : NSObject
+ (void)installIntoRuntime:(std::shared_ptr<facebook::jsi::Runtime> *)runtime withContainer:(ViroFabricContainer *)container;
@end

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super init]) {
        _bridge = bridge;
        _nodeRegistry = [NSMutableDictionary new];
        _eventCallbackRegistry = [NSMutableDictionary new];
        _isAR = NO;
        
        // Set up the runtime when the bridge is ready
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(bridgeDidFinishLaunch:)
                                                     name:RCTJavaScriptDidLoadNotification
                                                   object:bridge];
    }
    return self;
}

- (void)bridgeDidFinishLaunch:(NSNotification *)notification {
    // Get the bridge from the notification
    RCTBridge *bridge = notification.object;
    if (!bridge || ![bridge isKindOfClass:[RCTBridge class]]) {
        return;
    }
    
    // Try multiple approaches to get the JSI runtime
    
    // Approach 1: Try to get the runtime through TurboModuleManager
    id<RCTTurboModule> turboModuleManager = [bridge moduleForName:@"RCTTurboModuleManager" lazilyLoadIfNecessary:YES];
    if (turboModuleManager && [turboModuleManager respondsToSelector:NSSelectorFromString(@"runtime")]) {
        _runtime = (__bridge std::shared_ptr<facebook::jsi::Runtime> *)[turboModuleManager performSelector:NSSelectorFromString(@"runtime")];
        if (_runtime) {
            RCTLogInfo(@"Got runtime through TurboModuleManager");
            [ViroRuntimeBridge installIntoRuntime:_runtime withContainer:self];
            return;
        }
    }
    
    // Approach 2: Try to get the runtime through RCTCxxBridge
    if ([bridge respondsToSelector:NSSelectorFromString(@"runtime")]) {
        _runtime = (__bridge std::shared_ptr<facebook::jsi::Runtime> *)[bridge performSelector:NSSelectorFromString(@"runtime")];
        if (_runtime) {
            RCTLogInfo(@"Got runtime through bridge runtime method");
            [ViroRuntimeBridge installIntoRuntime:_runtime withContainer:self];
            return;
        }
    }
    
    // Approach 3: Try to get the runtime through RCTBridge+Private.h
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)[RCTBridge currentBridge];
    if (cxxBridge && [cxxBridge respondsToSelector:NSSelectorFromString(@"runtime")]) {
        _runtime = (__bridge std::shared_ptr<facebook::jsi::Runtime> *)[cxxBridge performSelector:NSSelectorFromString(@"runtime")];
        if (_runtime) {
            RCTLogInfo(@"Got runtime through RCTCxxBridge");
            [ViroRuntimeBridge installIntoRuntime:_runtime withContainer:self];
            return;
        }
    }
    
    RCTLogWarning(@"Could not get JSI runtime. Some functionality may be limited.");
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    // Update the frame of the navigator
    if (_sceneNavigator) {
        _sceneNavigator.frame = self.bounds;
    }
    if (_arSceneNavigator) {
        _arSceneNavigator.frame = self.bounds;
    }
}

#pragma mark - Commands

- (void)initialize:(NSString *)apiKey debug:(BOOL)debug arEnabled:(BOOL)arEnabled worldAlignment:(NSString *)worldAlignment {
    // Clean up any existing navigators
    [self cleanup];
    
    // Create the appropriate navigator based on the mode
    if (arEnabled) {
        _isAR = YES;
        _arSceneNavigator = [[VRTARSceneNavigator alloc] initWithFrame:self.bounds];
        [_arSceneNavigator setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
        [self addSubview:_arSceneNavigator];
        
        // Set world alignment if specified
        if ([worldAlignment isEqualToString:@"GravityAndHeading"]) {
            _arSceneNavigator.worldAlignment = @"GravityAndHeading";
        } else if ([worldAlignment isEqualToString:@"Camera"]) {
            _arSceneNavigator.worldAlignment = @"Camera";
        } else {
            _arSceneNavigator.worldAlignment = @"Gravity";
        }
    } else {
        _sceneNavigator = [[VRTSceneNavigator alloc] initWithFrame:self.bounds];
        [_sceneNavigator setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
        [self addSubview:_sceneNavigator];
    }
    
    // Notify JS that initialization is complete
    if (self.onInitialized) {
        self.onInitialized(@{@"success": @YES});
    }
}

- (void)cleanup {
    // Remove and release any existing navigators
    if (_sceneNavigator) {
        [_sceneNavigator removeFromSuperview];
        _sceneNavigator = nil;
    }
    if (_arSceneNavigator) {
        [_arSceneNavigator removeFromSuperview];
        _arSceneNavigator = nil;
    }
    
    // Clear node registry
    [_nodeRegistry removeAllObjects];
    
    // Clear event callback registry
    [_eventCallbackRegistry removeAllObjects];
    
    // Reset flags
    _isAR = NO;
}

#pragma mark - JSI Bindings

// This method is no longer used directly - JSI bindings are installed through ViroRuntimeBridge
- (void)installJSIBindings {
    RCTLogInfo(@"JSI bindings installation is now handled by ViroRuntimeBridge");
}

// Implementation of the runtime bridge
@implementation ViroRuntimeBridge

+ (void)installIntoRuntime:(std::shared_ptr<facebook::jsi::Runtime> *)runtimePtr withContainer:(ViroFabricContainer *)container {
    if (!runtimePtr || !(*runtimePtr)) {
        RCTLogError(@"JSI Runtime not available");
        return;
    }
    
    // Get a reference to the runtime
    facebook::jsi::Runtime &runtime = *(*runtimePtr);
    
    // Create the NativeViro object
    auto nativeViro = facebook::jsi::Object(runtime);
    
    // Node management functions
    nativeViro.setProperty(runtime, "createViroNode", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "createViroNode"),
        3,  // nodeId, nodeType, props
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 3) {
                throw JSError(rt, "createViroNode requires 3 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *nodeType = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            
            // Convert props from JSI to NSDictionary
            id props = [container convertJSIValueToObjC:args[2] runtime:rt];
            
            // Create the node based on type
            [container createNode:nodeId ofType:nodeType withProps:props];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "updateViroNode", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "updateViroNode"),
        2,  // nodeId, props
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 2) {
                throw JSError(rt, "updateViroNode requires 2 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            
            // Convert props from JSI to NSDictionary
            id props = [container convertJSIValueToObjC:args[1] runtime:rt];
            
            // Update the node
            [container updateNode:nodeId withProps:props];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "deleteViroNode", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "deleteViroNode"),
        1,  // nodeId
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 1) {
                throw JSError(rt, "deleteViroNode requires 1 argument");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            
            // Delete the node
            [container deleteNode:nodeId];
            
            return Value::undefined();
        }
    ));
    
    // Scene hierarchy functions
    nativeViro.setProperty(runtime, "addViroNodeChild", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "addViroNodeChild"),
        2,  // parentId, childId
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 2) {
                throw JSError(rt, "addViroNodeChild requires 2 arguments");
            }
            
            NSString *parentId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *childId = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            
            // Add child to parent
            [container addChild:childId toParent:parentId];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "removeViroNodeChild", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "removeViroNodeChild"),
        2,  // parentId, childId
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 2) {
                throw JSError(rt, "removeViroNodeChild requires 2 arguments");
            }
            
            NSString *parentId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *childId = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            
            // Remove child from parent
            [container removeChild:childId fromParent:parentId];
            
            return Value::undefined();
        }
    ));
    
    // Event handling functions
    nativeViro.setProperty(runtime, "registerEventCallback", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "registerEventCallback"),
        3,  // nodeId, eventName, callbackId
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 3) {
                throw JSError(rt, "registerEventCallback requires 3 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *eventName = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            NSString *callbackId = [NSString stringWithUTF8String:args[2].getString(rt).utf8(rt).c_str()];
            
            // Register event callback
            [container registerEventCallback:callbackId forEvent:eventName onNode:nodeId];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "unregisterEventCallback", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "unregisterEventCallback"),
        3,  // nodeId, eventName, callbackId
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 3) {
                throw JSError(rt, "unregisterEventCallback requires 3 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *eventName = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            NSString *callbackId = [NSString stringWithUTF8String:args[2].getString(rt).utf8(rt).c_str()];
            
            // Unregister event callback
            [container unregisterEventCallback:callbackId forEvent:eventName onNode:nodeId];
            
            return Value::undefined();
        }
    ));
    
    // Initialize function
    nativeViro.setProperty(runtime, "initialize", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "initialize"),
        1,  // apiKey
        [container](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 1) {
                throw JSError(rt, "initialize requires 1 argument");
            }
            
            NSString *apiKey = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            
            // Initialize Viro (this is a placeholder - actual initialization happens in the initialize: method)
            
            // Return a promise that resolves to true
            auto promise = Promise::createFromHostFunction(
                rt,
                [](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
                    return Value(true);
                }
            );
            
            return promise;
        }
    ));
    
    // Attach the NativeViro object to the global object
    runtime.global().setProperty(runtime, "NativeViro", std::move(nativeViro));
}

#pragma mark - Node Management

- (void)createNode:(NSString *)nodeId ofType:(NSString *)nodeType withProps:(NSDictionary *)props {
    // Get the appropriate navigator
    VRTSceneNavigator *navigator = [self getActiveNavigator];
    if (!navigator) {
        RCTLogError(@"Cannot create node: no active navigator");
        return;
    }
    
    // Store the node ID in the registry
    _nodeRegistry[nodeId] = @{@"type": nodeType, @"props": props ?: @{}};
    
    // If this is a scene node, add it to the navigator
    if ([nodeType isEqualToString:@"scene"]) {
        // For scene nodes, we need to create a VRTScene and set it on the navigator
        if (_sceneNavigator) {
            // Create a scene using the existing VRTScene implementation
            VRTScene *scene = [[VRTScene alloc] initWithBridge:_bridge];
            [scene setProps:props];
            [_sceneNavigator setScene:scene];
            _nodeRegistry[nodeId] = scene;
        }
    } else if ([nodeType isEqualToString:@"arScene"]) {
        // For AR scene nodes, we need to create a VRTARScene and set it on the navigator
        if (_arSceneNavigator) {
            // Create an AR scene using the existing VRTARScene implementation
            VRTARScene *arScene = [[VRTARScene alloc] initWithBridge:_bridge];
            [arScene setProps:props];
            [_arSceneNavigator setScene:arScene];
            _nodeRegistry[nodeId] = arScene;
        }
    } else {
        // For other node types, create the appropriate VRT node and add it to the scene
        // This would delegate to the existing VRT node creation logic
        // For example, for a box:
        if ([nodeType isEqualToString:@"box"]) {
            VRTBox *box = [[VRTBox alloc] initWithBridge:_bridge];
            [box setProps:props];
            _nodeRegistry[nodeId] = box;
        }
        // Similar implementations for other node types
    }
}

- (void)updateNode:(NSString *)nodeId withProps:(NSDictionary *)props {
    // Get the node from the registry
    id node = _nodeRegistry[nodeId];
    if (!node) {
        RCTLogError(@"Cannot update node: node not found");
        return;
    }
    
    // If the node is a VRT node, update its properties
    if ([node isKindOfClass:[VRTNode class]]) {
        [(VRTNode *)node setProps:props];
    } else {
        // If it's just a dictionary (for nodes we don't have a VRT class for yet),
        // update the props in the registry
        NSMutableDictionary *nodeInfo = [node mutableCopy];
        NSMutableDictionary *nodeProps = [nodeInfo[@"props"] mutableCopy];
        [nodeProps addEntriesFromDictionary:props];
        nodeInfo[@"props"] = nodeProps;
        _nodeRegistry[nodeId] = nodeInfo;
    }
}

- (void)deleteNode:(NSString *)nodeId {
    // Get the node from the registry
    id node = _nodeRegistry[nodeId];
    if (!node) {
        RCTLogError(@"Cannot delete node: node not found");
        return;
    }
    
    // If the node is a VRT node, remove it from its parent
    if ([node isKindOfClass:[VRTNode class]]) {
        VRTNode *vrtNode = (VRTNode *)node;
        [vrtNode removeFromParent];
    }
    
    // Remove the node from the registry
    [_nodeRegistry removeObjectForKey:nodeId];
}

- (void)addChild:(NSString *)childId toParent:(NSString *)parentId {
    // Get the parent and child nodes from the registry
    id parent = _nodeRegistry[parentId];
    id child = _nodeRegistry[childId];
    
    if (!parent || !child) {
        RCTLogError(@"Cannot add child: parent or child not found");
        return;
    }
    
    // If both parent and child are VRT nodes, add the child to the parent
    if ([parent isKindOfClass:[VRTNode class]] && [child isKindOfClass:[VRTNode class]]) {
        VRTNode *parentNode = (VRTNode *)parent;
        VRTNode *childNode = (VRTNode *)child;
        [parentNode addChildNode:childNode];
    } else {
        // If they're not both VRT nodes, update the parent-child relationship in the registry
        NSMutableDictionary *parentInfo = [parent isKindOfClass:[NSDictionary class]] ? [parent mutableCopy] : [NSMutableDictionary new];
        NSMutableArray *children = [parentInfo[@"children"] mutableCopy] ?: [NSMutableArray new];
        [children addObject:childId];
        parentInfo[@"children"] = children;
        _nodeRegistry[parentId] = parentInfo;
    }
}

- (void)removeChild:(NSString *)childId fromParent:(NSString *)parentId {
    // Get the parent and child nodes from the registry
    id parent = _nodeRegistry[parentId];
    id child = _nodeRegistry[childId];
    
    if (!parent || !child) {
        RCTLogError(@"Cannot remove child: parent or child not found");
        return;
    }
    
    // If both parent and child are VRT nodes, remove the child from the parent
    if ([parent isKindOfClass:[VRTNode class]] && [child isKindOfClass:[VRTNode class]]) {
        VRTNode *childNode = (VRTNode *)child;
        [childNode removeFromParent];
    } else {
        // If they're not both VRT nodes, update the parent-child relationship in the registry
        NSMutableDictionary *parentInfo = [parent isKindOfClass:[NSDictionary class]] ? [parent mutableCopy] : [NSMutableDictionary new];
        NSMutableArray *children = [parentInfo[@"children"] mutableCopy];
        [children removeObject:childId];
        parentInfo[@"children"] = children;
        _nodeRegistry[parentId] = parentInfo;
    }
}

// Helper method to get the active navigator
- (VRTSceneNavigator *)getActiveNavigator {
    if (_arSceneNavigator) {
        return _arSceneNavigator;
    } else {
        return _sceneNavigator;
    }
}

#pragma mark - Event Handling

- (void)registerEventCallback:(NSString *)callbackId forEvent:(NSString *)eventName onNode:(NSString *)nodeId {
    // Get the node from the registry
    id node = _nodeRegistry[nodeId];
    if (!node) {
        RCTLogError(@"Cannot register event callback: node not found");
        return;
    }
    
    // Store the callback ID in the registry
    NSString *key = [NSString stringWithFormat:@"%@_%@", nodeId, eventName];
    _eventCallbackRegistry[key] = callbackId;
    
    // If the node is a VRT node, register the event callback
    if ([node isKindOfClass:[VRTNode class]]) {
        VRTNode *vrtNode = (VRTNode *)node;
        
        // Create a block that will dispatch the event to JS
        __weak ViroFabricContainer *weakSelf = self;
        VRTEventCallback callback = ^(NSDictionary *event) {
            [weakSelf dispatchEventToJS:callbackId withData:event];
        };
        
        // Register the event callback with the node
        [vrtNode registerEventCallback:callback withName:eventName];
    }
}

- (void)unregisterEventCallback:(NSString *)callbackId forEvent:(NSString *)eventName onNode:(NSString *)nodeId {
    // Get the node from the registry
    id node = _nodeRegistry[nodeId];
    if (!node) {
        RCTLogError(@"Cannot unregister event callback: node not found");
        return;
    }
    
    // Remove the callback ID from the registry
    NSString *key = [NSString stringWithFormat:@"%@_%@", nodeId, eventName];
    [_eventCallbackRegistry removeObjectForKey:key];
    
    // If the node is a VRT node, unregister the event callback
    if ([node isKindOfClass:[VRTNode class]]) {
        VRTNode *vrtNode = (VRTNode *)node;
        
        // Unregister the event callback from the node
        [vrtNode unregisterEventCallback:eventName];
    }
}

- (void)dispatchEventToJS:(NSString *)callbackId withData:(NSDictionary *)data {
    // Dispatch the event to JS through the bridge
    if (_runtime) {
        auto &runtime = *_runtime;
        
        try {
            auto global = runtime.global();
            if (global.hasProperty(runtime, "handleViroEvent")) {
                auto handleViroEvent = global.getPropertyAsFunction(runtime, "handleViroEvent");
                auto jsData = [self convertObjCToJSIValue:data runtime:runtime];
                handleViroEvent.call(runtime, facebook::jsi::String::createFromUtf8(runtime, [callbackId UTF8String]), jsData);
            } else {
                RCTLogError(@"handleViroEvent function not found in global object");
            }
        } catch (const std::exception &e) {
            RCTLogError(@"Error dispatching event to JS: %s", e.what());
        }
    } else if (_bridge) {
        // Fallback to RCTEventEmitter approach
        RCTLogInfo(@"JSI runtime not available, using event emitter fallback for callback %@: %@", callbackId, data);
        
        // Send event through the ViroFabricManager
        [[ViroFabricManager sharedInstance] sendEventWithName:@"ViroEvent"
                                                         body:@{
                                                             @"callbackId": callbackId,
                                                             @"data": data
                                                         }];
    }
}

@end

#pragma mark - Utility Methods

- (id)convertJSIValueToObjC:(const facebook::jsi::Value &)value runtime:(facebook::jsi::Runtime &)runtime {
    if (value.isUndefined() || value.isNull()) {
        return nil;
    } else if (value.isBool()) {
        return @(value.getBool());
    } else if (value.isNumber()) {
        return @(value.getNumber());
    } else if (value.isString()) {
        return [NSString stringWithUTF8String:value.getString(runtime).utf8(runtime).c_str()];
    } else if (value.isObject()) {
        auto object = value.getObject(runtime);
        
        if (object.isArray(runtime)) {
            auto array = object.getArray(runtime);
            NSMutableArray *result = [NSMutableArray new];
            
            for (size_t i = 0; i < array.size(runtime); i++) {
                [result addObject:[self convertJSIValueToObjC:array.getValueAtIndex(runtime, i) runtime:runtime] ?: [NSNull null]];
            }
            
            return result;
        } else {
            NSMutableDictionary *result = [NSMutableDictionary new];
            auto propertyNames = object.getPropertyNames(runtime);
            
            for (size_t i = 0; i < propertyNames.size(runtime); i++) {
                auto name = propertyNames.getValueAtIndex(runtime, i).getString(runtime);
                auto prop = object.getProperty(runtime, name);
                
                NSString *key = [NSString stringWithUTF8String:name.utf8(runtime).c_str()];
                id value = [self convertJSIValueToObjC:prop runtime:runtime];
                
                if (value) {
                    result[key] = value;
                } else {
                    result[key] = [NSNull null];
                }
            }
            
            return result;
        }
    }
    
    return nil;
}

- (facebook::jsi::Value)convertObjCToJSIValue:(id)value runtime:(facebook::jsi::Runtime &)runtime {
    if (value == nil || [value isKindOfClass:[NSNull class]]) {
        return facebook::jsi::Value::null();
    } else if ([value isKindOfClass:[NSNumber class]]) {
        if ([value isKindOfClass:[@YES class]]) {
            return facebook::jsi::Value([(NSNumber *)value boolValue]);
        } else {
            return facebook::jsi::Value([(NSNumber *)value doubleValue]);
        }
    } else if ([value isKindOfClass:[NSString class]]) {
        return facebook::jsi::String::createFromUtf8(runtime, [(NSString *)value UTF8String]);
    } else if ([value isKindOfClass:[NSArray class]]) {
        auto result = facebook::jsi::Array(runtime, [(NSArray *)value count]);
        
        [((NSArray *)value) enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
            result.setValueAtIndex(runtime, idx, [self convertObjCToJSIValue:obj runtime:runtime]);
        }];
        
        return result;
    } else if ([value isKindOfClass:[NSDictionary class]]) {
        auto result = facebook::jsi::Object(runtime);
        
        [((NSDictionary *)value) enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
            result.setProperty(runtime, [key UTF8String], [self convertObjCToJSIValue:obj runtime:runtime]);
        }];
        
        return result;
    }
    
    return facebook::jsi::Value::undefined();
}

@end
