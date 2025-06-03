//
//  ViroFabricContainer.mm
//  ViroReact
//
//  Created for Viro Media.
//  Copyright © 2025 Viro Media. All rights reserved.
//

#import "ViroFabricContainer.h"
#import <React/RCTLog.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>
#import <React/RCTBridge+Private.h>
#import <jsi/jsi.h>

// Import existing Viro headers
#import "VRTSceneNavigator.h"
#import "VRTARSceneNavigator.h"
#import "VRTVRSceneNavigator.h"

using namespace facebook::jsi;

@interface ViroFabricContainer () {
    // Reference to the existing Viro navigator
    VRTSceneNavigator *_sceneNavigator;
    VRTARSceneNavigator *_arSceneNavigator;
    VRTVRSceneNavigator *_vrSceneNavigator;
    
    // JSI runtime
    std::shared_ptr<facebook::jsi::Runtime> _runtime;
    
    // Node registry
    NSMutableDictionary<NSString *, id> *_nodeRegistry;
    
    // Event callback registry
    NSMutableDictionary<NSString *, NSString *> *_eventCallbackRegistry;
    
    // Flag to track if we're using AR
    BOOL _isAR;
    
    // Flag to track if we're using VR
    BOOL _isVR;
    
    // Bridge reference
    __weak RCTBridge *_bridge;
}

@end

@implementation ViroFabricContainer

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if (self = [super init]) {
        _bridge = bridge;
        _nodeRegistry = [NSMutableDictionary new];
        _eventCallbackRegistry = [NSMutableDictionary new];
        _isAR = NO;
        _isVR = NO;
        
        // Get the JSI runtime
        _runtime = bridge.jsCallInvoker.runtime();
        
        // Install JSI bindings
        [self installJSIBindings];
    }
    return self;
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
    if (_vrSceneNavigator) {
        _vrSceneNavigator.frame = self.bounds;
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
            _arSceneNavigator.worldAlignment = VROWorldAlignment::GravityAndHeading;
        } else if ([worldAlignment isEqualToString:@"Camera"]) {
            _arSceneNavigator.worldAlignment = VROWorldAlignment::Camera;
        } else {
            _arSceneNavigator.worldAlignment = VROWorldAlignment::Gravity;
        }
    } else if (_isVR) {
        _vrSceneNavigator = [[VRTVRSceneNavigator alloc] initWithFrame:self.bounds];
        [_vrSceneNavigator setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
        [self addSubview:_vrSceneNavigator];
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
    if (_vrSceneNavigator) {
        [_vrSceneNavigator removeFromSuperview];
        _vrSceneNavigator = nil;
    }
    
    // Clear node registry
    [_nodeRegistry removeAllObjects];
    
    // Clear event callback registry
    [_eventCallbackRegistry removeAllObjects];
    
    // Reset flags
    _isAR = NO;
    _isVR = NO;
}

#pragma mark - JSI Bindings

- (void)installJSIBindings {
    if (!_runtime) {
        RCTLogError(@"JSI Runtime not available");
        return;
    }
    
    auto &runtime = *_runtime;
    
    // Create the NativeViro object
    auto nativeViro = Object(runtime);
    
    // Node management functions
    nativeViro.setProperty(runtime, "createViroNode", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "createViroNode"),
        3,  // nodeId, nodeType, props
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 3) {
                throw JSError(rt, "createViroNode requires 3 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *nodeType = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            
            // Convert props from JSI to NSDictionary
            id props = [self convertJSIValueToObjC:args[2] runtime:rt];
            
            // Create the node based on type
            [self createNode:nodeId ofType:nodeType withProps:props];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "updateViroNode", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "updateViroNode"),
        2,  // nodeId, props
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 2) {
                throw JSError(rt, "updateViroNode requires 2 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            
            // Convert props from JSI to NSDictionary
            id props = [self convertJSIValueToObjC:args[1] runtime:rt];
            
            // Update the node
            [self updateNode:nodeId withProps:props];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "deleteViroNode", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "deleteViroNode"),
        1,  // nodeId
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 1) {
                throw JSError(rt, "deleteViroNode requires 1 argument");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            
            // Delete the node
            [self deleteNode:nodeId];
            
            return Value::undefined();
        }
    ));
    
    // Scene hierarchy functions
    nativeViro.setProperty(runtime, "addViroNodeChild", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "addViroNodeChild"),
        2,  // parentId, childId
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 2) {
                throw JSError(rt, "addViroNodeChild requires 2 arguments");
            }
            
            NSString *parentId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *childId = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            
            // Add child to parent
            [self addChild:childId toParent:parentId];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "removeViroNodeChild", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "removeViroNodeChild"),
        2,  // parentId, childId
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 2) {
                throw JSError(rt, "removeViroNodeChild requires 2 arguments");
            }
            
            NSString *parentId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *childId = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            
            // Remove child from parent
            [self removeChild:childId fromParent:parentId];
            
            return Value::undefined();
        }
    ));
    
    // Event handling functions
    nativeViro.setProperty(runtime, "registerEventCallback", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "registerEventCallback"),
        3,  // nodeId, eventName, callbackId
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 3) {
                throw JSError(rt, "registerEventCallback requires 3 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *eventName = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            NSString *callbackId = [NSString stringWithUTF8String:args[2].getString(rt).utf8(rt).c_str()];
            
            // Register event callback
            [self registerEventCallback:callbackId forEvent:eventName onNode:nodeId];
            
            return Value::undefined();
        }
    ));
    
    nativeViro.setProperty(runtime, "unregisterEventCallback", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "unregisterEventCallback"),
        3,  // nodeId, eventName, callbackId
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
            if (count < 3) {
                throw JSError(rt, "unregisterEventCallback requires 3 arguments");
            }
            
            NSString *nodeId = [NSString stringWithUTF8String:args[0].getString(rt).utf8(rt).c_str()];
            NSString *eventName = [NSString stringWithUTF8String:args[1].getString(rt).utf8(rt).c_str()];
            NSString *callbackId = [NSString stringWithUTF8String:args[2].getString(rt).utf8(rt).c_str()];
            
            // Unregister event callback
            [self unregisterEventCallback:callbackId forEvent:eventName onNode:nodeId];
            
            return Value::undefined();
        }
    ));
    
    // Initialize function
    nativeViro.setProperty(runtime, "initialize", Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "initialize"),
        1,  // apiKey
        [this](Runtime& rt, const Value& thisValue, const Value* args, size_t count) -> Value {
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
    // This is a placeholder implementation
    // In a real implementation, you would create the appropriate node type
    // and add it to the scene graph
    
    // For now, just store the node ID in the registry
    _nodeRegistry[nodeId] = @{@"type": nodeType, @"props": props ?: @{}};
    
    // If this is a scene node, add it to the navigator
    if ([nodeType isEqualToString:@"scene"]) {
        // Create a scene and add it to the navigator
        // This would use the existing VRTScene implementation
    } else if ([nodeType isEqualToString:@"arScene"]) {
        // Create an AR scene and add it to the navigator
        // This would use the existing VRTARScene implementation
    }
}

- (void)updateNode:(NSString *)nodeId withProps:(NSDictionary *)props {
    // This is a placeholder implementation
    // In a real implementation, you would update the node's properties
    
    // For now, just update the props in the registry
    NSMutableDictionary *nodeInfo = [_nodeRegistry[nodeId] mutableCopy];
    if (nodeInfo) {
        NSMutableDictionary *nodeProps = [nodeInfo[@"props"] mutableCopy];
        [nodeProps addEntriesFromDictionary:props];
        nodeInfo[@"props"] = nodeProps;
        _nodeRegistry[nodeId] = nodeInfo;
    }
}

- (void)deleteNode:(NSString *)nodeId {
    // This is a placeholder implementation
    // In a real implementation, you would remove the node from the scene graph
    
    // For now, just remove the node from the registry
    [_nodeRegistry removeObjectForKey:nodeId];
}

- (void)addChild:(NSString *)childId toParent:(NSString *)parentId {
    // This is a placeholder implementation
    // In a real implementation, you would add the child node to the parent node
    
    // For now, just update the parent-child relationship in the registry
    NSMutableDictionary *parentInfo = [_nodeRegistry[parentId] mutableCopy];
    if (parentInfo) {
        NSMutableArray *children = [parentInfo[@"children"] mutableCopy] ?: [NSMutableArray new];
        [children addObject:childId];
        parentInfo[@"children"] = children;
        _nodeRegistry[parentId] = parentInfo;
    }
}

- (void)removeChild:(NSString *)childId fromParent:(NSString *)parentId {
    // This is a placeholder implementation
    // In a real implementation, you would remove the child node from the parent node
    
    // For now, just update the parent-child relationship in the registry
    NSMutableDictionary *parentInfo = [_nodeRegistry[parentId] mutableCopy];
    if (parentInfo) {
        NSMutableArray *children = [parentInfo[@"children"] mutableCopy];
        [children removeObject:childId];
        parentInfo[@"children"] = children;
        _nodeRegistry[parentId] = parentInfo;
    }
}

#pragma mark - Event Handling

- (void)registerEventCallback:(NSString *)callbackId forEvent:(NSString *)eventName onNode:(NSString *)nodeId {
    // This is a placeholder implementation
    // In a real implementation, you would register the event callback with the node
    
    // For now, just store the callback ID in the registry
    NSString *key = [NSString stringWithFormat:@"%@_%@", nodeId, eventName];
    _eventCallbackRegistry[key] = callbackId;
}

- (void)unregisterEventCallback:(NSString *)callbackId forEvent:(NSString *)eventName onNode:(NSString *)nodeId {
    // This is a placeholder implementation
    // In a real implementation, you would unregister the event callback from the node
    
    // For now, just remove the callback ID from the registry
    NSString *key = [NSString stringWithFormat:@"%@_%@", nodeId, eventName];
    [_eventCallbackRegistry removeObjectForKey:key];
}

- (void)dispatchEventToJS:(NSString *)callbackId withData:(NSDictionary *)data {
    // This is a placeholder implementation
    // In a real implementation, you would dispatch the event to JS
    
    // For now, just log the event
    RCTLogInfo(@"Dispatching event to JS: %@ with data: %@", callbackId, data);
    
    // In a real implementation, you would use JSI to call the handleViroEvent function
    if (_runtime) {
        auto &runtime = *_runtime;
        
        // Convert data to JSI value
        auto jsData = [self convertObjCToJSIValue:data runtime:runtime];
        
        // Call the handleViroEvent function
        auto handleViroEvent = runtime.global().getPropertyAsFunction(runtime, "handleViroEvent");
        handleViroEvent.call(runtime, String::createFromUtf8(runtime, [callbackId UTF8String]), jsData);
    }
}

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
