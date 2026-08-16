import type { Ratio } from "../../ji/ratio";
import {
  createExpandedRadialAddress,
  type ExpandedRadialAddress,
} from "./createExpandedRadialAddress";
import { createRadialAddress, type RadialAddress } from "./createRadialAddress";
import { factorPrimesIgnoringTwo } from "./factorPrimesIgnoringTwo";

export type RadialVisualizationPlacement =
  | Readonly<{
      type: "standard";
      address: RadialAddress;
    }>
  | Readonly<{
      type: "expanded";
      address: ExpandedRadialAddress;
    }>;

export function createRadialVisualizationPlacement(
  ratio: Ratio,
  includeLowerOctave: boolean,
): RadialVisualizationPlacement {
  if (includeLowerOctave) {
    return {
      type: "expanded",
      address: createExpandedRadialAddress(ratio),
    };
  }

  return {
    type: "standard",
    address: createRadialAddress(factorPrimesIgnoringTwo(ratio)),
  };
}
