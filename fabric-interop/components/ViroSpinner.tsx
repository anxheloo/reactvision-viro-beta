/**
 * ViroSpinner
 *
 * Composite control for a 2D Spinner.
 */

import * as React from "react";
import { ViroNode } from "./ViroNode";
import { ViroImage } from "./ViroImage";
import ViroAnimations from "./Animation/ViroAnimations";
import { ViroCommonProps } from "./ViroUtils";
import { getNativeViro } from "./ViroGlobal";

// Setup spinner assets
const ViroSpinner_1 = require("../../../components/Resources/viro_spinner_1.png");
const ViroSpinner_1a = require("../../../components/Resources/viro_spinner_1a.png");
const ViroSpinner_1_w = require("../../../components/Resources/viro_spinner_1_w.png");
const ViroSpinner_1a_w = require("../../../components/Resources/viro_spinner_1a_w.png");

type Props = ViroCommonProps & {
  type?: "Dark" | "Light" | "dark" | "light";
  materials?: string | string[];
};

/**
 * Composite control for a 2D Spinner
 */
export function ViroSpinner(props: Props): React.ReactElement {
  const { type = "Dark", ...rest } = props;

  // Get the appropriate spinner images based on type
  const getImage1 = () => {
    return type.toUpperCase() === "LIGHT" ? ViroSpinner_1 : ViroSpinner_1_w;
  };

  const getImage1a = () => {
    return type.toUpperCase() === "LIGHT" ? ViroSpinner_1a : ViroSpinner_1a_w;
  };

  return (
    <ViroNode {...rest}>
      <ViroImage
        source={getImage1()}
        materials={props.materials}
        animation={{
          name: "_ViroSpinner_clockwiseZ",
          delay: 0,
          loop: true,
          run: true,
        }}
      />

      {/* Set the position of this one to be .01 forward of the other view to help w/ z-fighting*/}
      <ViroImage
        position={[0, 0, 0.01]}
        source={getImage1a()}
        materials={props.materials}
        animation={{
          name: "_ViroSpinner_counterClockwiseZ",
          delay: 0,
          loop: true,
          run: true,
        }}
      />
    </ViroNode>
  );
}

// Register the spinner animations
ViroAnimations.registerAnimations({
  _ViroSpinner_counterClockwiseZ: {
    properties: {
      rotateZ: "+=90",
    },
    duration: 250, // .25 seconds
  },
  _ViroSpinner_clockwiseZ: {
    properties: {
      rotateZ: "-=90",
    },
    duration: 250, // .25 seconds
  },
});
