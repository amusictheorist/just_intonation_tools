import type { Ratio } from "../../ji/ratio/ratio";
import type { PrimeFactorStep } from "./createCanonicalPrimeFactorPath";
import { createRadialAddress } from "./createRadialAddress";
import { factorPrimesIgnoringTwo } from "./factorPrimesIgnoringTwo";
import { normalizeExpandedRadialRatio } from "./normalizeExpandedRadialRatio";

/**
 * Represents the symbolic location used by expanded radial placement.
 *
 * `normalizedRatio` preserves whether the original ratio lies above or below unison while placing it in the corresponding target octave.
 * `side` records that upper- or lower-half relationship explicitly.
 *
 * `path` records the canonical signed prime-factor path from 1/1, and `distance` records the total number of steps in that path.
 *
 * The address contains symbolic placement information only. Radial angles, symmetry choices, and Cartesian coordinates belong to the geometry layer.
 */

export type ExpandedRadialAddress = Readonly<{
  normalizedRatio: Ratio;
  side: "upper" | "lower";
  path: readonly PrimeFactorStep[];
  distance: number;
}>;

/**
 * Creates a symbolic expanded-radial address from an exact ratio.
 *
 * The ratio is first normalized into [1, 2) when it is at or above unison, or [1/2, 1) when it is below unison. Powers of 2 do not contribute to the prime-factor path, so normalization preserves the symbolic generator structure while retaining the ratio's side of unison.
 *
 * @param ratio A validated exact ratio.
 * @returns The side-preserving normalized ratio, canonical prime-factor path, and generator distance used by expanded radial placement.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createExpandedRadialAddress(
  ratio: Ratio,
): ExpandedRadialAddress {
  const normalizedRatio = normalizeExpandedRadialRatio(ratio);
  const radialAddress = createRadialAddress(
    normalizedRatio,
    factorPrimesIgnoringTwo(ratio),
  );
  const side: "upper" | "lower" =
    normalizedRatio.numerator >= normalizedRatio.denominator
      ? "upper"
      : "lower";

  return {
    normalizedRatio,
    side,
    path: radialAddress.path,
    distance: radialAddress.distance,
  };
}
