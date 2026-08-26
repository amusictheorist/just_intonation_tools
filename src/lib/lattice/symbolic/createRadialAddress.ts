import type { Ratio } from "../../ji/ratio/ratio";
import { calculateGeneratorDistance } from "./calculateGeneratorDistance";
import {
  createCanonicalPrimeFactorPath,
  type PrimeFactorStep,
} from "./createCanonicalPrimeFactorPath";
import type { PrimeExponents } from "./primeExponents";

/**
 * Represents the symbolic prime-factor structure used by radial placement.
 *
 * `path` records the canonical sequence of signed prime-factor steps from 1/1, while `distance` records the total number of steps in that path.
 *
 * This address does not yet contain rendered directions or Cartesian coordinates; those belong to the geometry layer.
 */

export type RadialAddress = Readonly<{
  normalizedRatio: Ratio;
  path: readonly PrimeFactorStep[];
  distance: number;
}>;

/**
 * Creates the shared symbolic address used by radial lattice placement.
 *
 * The canonical prime-factor path preserves numerator and denominator direction and orders prime factors deterministically. Generator distance is derived from the number of steps in that path.
 *
 * @param factors A validated map of prime exponents.
 * @returns The canonical radial address and its generator distance.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createRadialAddress(
  normalizedRatio: Ratio,
  factors: PrimeExponents,
): RadialAddress {
  const path = createCanonicalPrimeFactorPath(factors);

  return {
    normalizedRatio,
    path,
    distance: calculateGeneratorDistance(path),
  };
}
