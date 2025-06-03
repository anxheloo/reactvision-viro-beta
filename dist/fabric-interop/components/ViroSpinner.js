"use strict";
/**
 * ViroSpinner
 *
 * Composite control for a 2D Spinner.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViroSpinner = ViroSpinner;
const React = __importStar(require("react"));
const ViroNode_1 = require("./ViroNode");
const ViroImage_1 = require("./ViroImage");
const ViroAnimations_1 = __importDefault(require("./Animation/ViroAnimations"));
// Setup spinner assets
const ViroSpinner_1 = require("../../../components/Resources/viro_spinner_1.png");
const ViroSpinner_1a = require("../../../components/Resources/viro_spinner_1a.png");
const ViroSpinner_1_w = require("../../../components/Resources/viro_spinner_1_w.png");
const ViroSpinner_1a_w = require("../../../components/Resources/viro_spinner_1a_w.png");
/**
 * Composite control for a 2D Spinner
 */
function ViroSpinner(props) {
    const { type = "Dark", ...rest } = props;
    // Get the appropriate spinner images based on type
    const getImage1 = () => {
        return type.toUpperCase() === "LIGHT" ? ViroSpinner_1 : ViroSpinner_1_w;
    };
    const getImage1a = () => {
        return type.toUpperCase() === "LIGHT" ? ViroSpinner_1a : ViroSpinner_1a_w;
    };
    return (<ViroNode_1.ViroNode {...rest}>
      <ViroImage_1.ViroImage source={getImage1()} materials={props.materials} animation={{
            name: "_ViroSpinner_clockwiseZ",
            delay: 0,
            loop: true,
            run: true,
        }}/>

      {/* Set the position of this one to be .01 forward of the other view to help w/ z-fighting*/}
      <ViroImage_1.ViroImage position={[0, 0, 0.01]} source={getImage1a()} materials={props.materials} animation={{
            name: "_ViroSpinner_counterClockwiseZ",
            delay: 0,
            loop: true,
            run: true,
        }}/>
    </ViroNode_1.ViroNode>);
}
// Register the spinner animations
ViroAnimations_1.default.registerAnimations({
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
