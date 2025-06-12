//
//  ViroFabricManager.h
//  ViroReact
//
//  Created for ReactVision.
//  Copyright © 2025 ReactVision. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface ViroFabricManager : RCTEventEmitter <RCTBridgeModule>

// Singleton method to get the shared instance
+ (instancetype)sharedInstance;

// Method to emit events to JavaScript
- (void)sendEventWithName:(NSString *)name body:(NSDictionary *)body;

@end
