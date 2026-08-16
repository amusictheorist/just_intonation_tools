import type { Ratio } from "../../ji/ratio";
import { createCubicPlacement } from "./createCubicPlacement";
import {
  createExpandedCubicAddress,
  type ExpandedCubicAddress,
} from "./createExpandedCubicAddress";
import type { CubicCoordinates } from "./cubicCoordinates";
import { factorPrimesIgnoringTwo } from "./factorPrimesIgnoringTwo";

export type CubicVisualizationPlacement =
  | Readonly<{
      type: "standard";
      coordinates: CubicCoordinates;
    }>
  | Readonly<{
      type: "expanded";
      address: ExpandedCubicAddress;
    }>;

export function createCubicVisualizationPlacement(
  ratio: Ratio,
  includeHigherPrimes: boolean,
): CubicVisualizationPlacement | null {
  if (includeHigherPrimes) {
    return {
      type: "expanded",
      address: createExpandedCubicAddress(factorPrimesIgnoringTwo(ratio)),
    };
  }
  const coordinates = createCubicPlacement(ratio);

  if (!coordinates) return null;

  return {
    type: "standard",
    coordinates,
  };
}
