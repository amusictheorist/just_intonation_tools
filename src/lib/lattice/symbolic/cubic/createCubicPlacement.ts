import type { Ratio } from "../../../ji/ratio/ratio";
import {
  createStandardCubicCoordinates,
  type CubicCoordinates,
} from "./cubicCoordinates";
import { factorPrimesIgnoringTwo } from "../factorPrimesIgnoringTwo";

export function createCubicPlacement(ratio: Ratio): CubicCoordinates | null {
  const factors = factorPrimesIgnoringTwo(ratio);

  return createStandardCubicCoordinates(factors);
}
