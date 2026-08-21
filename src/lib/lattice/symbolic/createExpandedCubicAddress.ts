import {
  createCanonicalPrimeFactorPath,
  type PrimeFactorStep,
} from "./createCanonicalPrimeFactorPath";
import {
  extractCubicCoordinates,
  type CubicCoordinates,
} from "./cubicCoordinates";
import type { PrimeExponents } from "./primeExponents";

/**
 * Represents a symbolic location in the expanded cubic lattice.
 *
 * Unlike standard cubic coordinates, and expanded cubic address has two parts: `anchorPath` identifies the nested higher-prime lattice, while `coordinates357` identifies the position within that lattice's local 3-5-7 coordinate system.
 */

export type ExpandedCubicAddress = Readonly<{
  anchorPath: readonly PrimeFactorStep[];
  coordinates357: CubicCoordinates;
}>;

/**
 * Converts prime exponents into a symbolic expanded-cubic address.
 *
 * Prime factors 3, 5, and 7 determine the local cubic coordinates.
 * Prime factors above 7 determine the canonical higher-prime anchor path, with repeated factors producing repeated nested anchor steps.
 *
 * The anochor path is ordered canonically by ascending prime value, while numerator and denominator factors retain their positive and negative directions.
 *
 * @param factors A validated map of prime exponents
 * @returns Expanded cubic address with canonical prime factor path and local 3-5-7 coordinates.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createExpandedCubicAddress(
  factors: PrimeExponents,
): ExpandedCubicAddress {
  const baseFactors = new Map<bigint, number>();
  const higherPrimeFactors = new Map<bigint, number>();

  for (const [prime, exponent] of factors) {
    if (prime <= 7n) baseFactors.set(prime, exponent);
    if (prime > 7n) higherPrimeFactors.set(prime, exponent);
  }

  const coordinates357 = extractCubicCoordinates(baseFactors);

  return {
    anchorPath: createCanonicalPrimeFactorPath(higherPrimeFactors),
    coordinates357,
  };
}
