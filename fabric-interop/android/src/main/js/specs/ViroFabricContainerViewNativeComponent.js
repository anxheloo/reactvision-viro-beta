/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

"use strict";

import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import type { HostComponent } from "react-native";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";
import codegenNativeCommands from "react-native/Libraries/Utilities/codegenNativeCommands";

type NativeProps = $ReadOnly<{|
  ...ViewProps,

  // Props
  apiKey?: ?string,
  debug?: boolean,
  arEnabled?: boolean,
  worldAlignment?: ?string,

  // Events
  onInitialized?: ?(event: { success: boolean }) => mixed,
  onTrackingUpdated?: ?(event: Object) => mixed,
  onCameraTransformUpdate?: ?(event: Object) => mixed,
|}>;

type ViroFabricContainerViewType = HostComponent<NativeProps>;

interface NativeCommands {
  +initialize: (
    viewRef: React.ElementRef<ViroFabricContainerViewType>,
    apiKey: string,
    debug: boolean,
    arEnabled: boolean,
    worldAlignment: string
  ) => void;

  +cleanup: (viewRef: React.ElementRef<ViroFabricContainerViewType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ["initialize", "cleanup"],
});

export default codegenNativeComponent<NativeProps>("ViroFabricContainerView");
