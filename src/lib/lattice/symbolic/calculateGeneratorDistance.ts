import type { PrimeFactorStep } from "./createCanonicalPrimeFactorPath";

/**
 * Returns the generator distance represented by a prime-factor path.
 *
 * Generator distance is the number of symbolic prime-factor steps from 1/1, so each repeated numerator or denominator factor contributes one unit of distance.
 *
 * @param path A validated canonical prime factor path.
 * @returns Its length.
 */

export function calculateGeneratorDistance(
  path: readonly PrimeFactorStep[],
): number {
  return path.length;
}
