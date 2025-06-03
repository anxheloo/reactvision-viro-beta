/**
 * ViroPortalScene
 *
 * A component for creating the environment inside a portal.
 */

import React from "react";
import { ViroCommonProps, useViroNode, convertCommonProps } from "./ViroUtils";

export interface ViroPortalSceneProps extends ViroCommonProps {
  // Portal scene properties
  passable?: boolean;

  // Events
  onPortalEnter?: () => void;
  onPortalExit?: () => void;

  // Children components
  children?: React.ReactNode;
}

/**
 * ViroPortalScene is a component for creating the environment inside a portal.
 * It contains the content that will be visible through a ViroPortal.
 */
export const ViroPortalScene: React.FC<ViroPortalSceneProps> = (props) => {
  // Convert common props to the format expected by the native code
  const nativeProps = {
    ...convertCommonProps(props),
    passable: props.passable,
    onPortalEnter: props.onPortalEnter ? true : undefined,
    onPortalExit: props.onPortalExit ? true : undefined,
  };

  // Create the node
  const nodeId = useViroNode("portalScene", nativeProps, "viro_root_scene");

  // Register event handlers
  React.useEffect(() => {
    if (!global.NativeViro) return;

    // Register event handlers if provided
    if (props.onPortalEnter) {
      const callbackId = `${nodeId}_portal_enter`;
      global.NativeViro.registerEventCallback(
        nodeId,
        "onPortalEnter",
        callbackId
      );
    }

    if (props.onPortalExit) {
      const callbackId = `${nodeId}_portal_exit`;
      global.NativeViro.registerEventCallback(
        nodeId,
        "onPortalExit",
        callbackId
      );
    }

    // Cleanup when unmounting
    return () => {
      if (!global.NativeViro) return;

      if (props.onPortalEnter) {
        const callbackId = `${nodeId}_portal_enter`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onPortalEnter",
          callbackId
        );
      }

      if (props.onPortalExit) {
        const callbackId = `${nodeId}_portal_exit`;
        global.NativeViro.unregisterEventCallback(
          nodeId,
          "onPortalExit",
          callbackId
        );
      }
    };
  }, [nodeId, props.onPortalEnter, props.onPortalExit]);

  // Render children with this node as their parent
  return props.children ? (
    <ViroContext.Provider value={nodeId}>{props.children}</ViroContext.Provider>
  ) : null;
};

// Import ViroContext at the top level to avoid circular dependencies
import { ViroContext } from "./ViroUtils";
