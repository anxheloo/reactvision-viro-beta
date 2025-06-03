//
//  ViroFabricContainer.h
//  ViroReact
//
//  Created for Viro Media.
//  Copyright © 2025 Viro Media. All rights reserved.
//

#import <React/RCTView.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface ViroFabricContainer : RCTView

@property (nonatomic, copy) RCTDirectEventBlock onInitialized;
@property (nonatomic, copy) RCTDirectEventBlock onTrackingUpdated;
@property (nonatomic, copy) RCTDirectEventBlock onCameraTransformUpdate;

- (instancetype)initWithBridge:(RCTBridge *)bridge;

// Commands
- (void)initialize:(NSString *)apiKey debug:(BOOL)debug arEnabled:(BOOL)arEnabled worldAlignment:(NSString *)worldAlignment;
- (void)cleanup;

@end
