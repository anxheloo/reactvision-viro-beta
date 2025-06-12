/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import type { ViewProps } from "react-native";
import type { HostComponent } from "react-native";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";
import codegenNativeCommands from "react-native/Libraries/Utilities/codegenNativeCommands";

export interface NativeProps extends ViewProps {
  // Props
  apiKey?: string;
  debug?: boolean;
  arEnabled?: boolean;
  worldAlignment?: string;

  // Events
  onInitialized?: (event: { nativeEvent: { success: boolean } }) => void;
  onTrackingUpdated?: (event: { nativeEvent: any }) => void;
  onCameraTransformUpdate?: (event: { nativeEvent: any }) => void;
}

export type ViroFabricContainerViewType = HostComponent<NativeProps>;

interface NativeCommands {
  initialize: (
    viewRef: React.ElementRef<ViroFabricContainerViewType>,
    apiKey: string,
    debug: boolean,
    arEnabled: boolean,
    worldAlignment: string
  ) => void;

  cleanup: (viewRef: React.ElementRef<ViroFabricContainerViewType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ["initialize", "cleanup"],
});

export default codegenNativeComponent<NativeProps>("ViroFabricContainerView");
