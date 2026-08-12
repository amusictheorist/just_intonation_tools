import type { PrimeExponents } from "./factorPrimesIgnoringTwo";

/**
 * Represents one step in a symbolic prime-factor path.
 *
 * `prime` identifies the prime factor that contributes the step.
 * `direction` is `1` for a numerator factor and `-1` for a denominator factor.
 */

export type PrimeFactorStep = Readonly<{
  prime: bigint;
  direction: 1 | -1;
}>;

/**
 * Expands signed prime exponents into a canonical symbolic path from 1/1.
 *
 * Each occurrence of a prime factor contributes one step, so repeated factors produce repeated steps. Prime factors are ordered by ascending prime value regardless of direction, giving a deterministic path when multiple equally short multiplication orders are possible.
 *
 * The resulting path is shortest in the sense that its length equals the total number of prime-factor occurrences represented by the exponents.
 *
 * @param factors A validated map of prime exponents.
 * @returns The canonical prime factor path as pairs of primes and directions.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createCanonicalPrimeFactorPath(
  factors: PrimeExponents,
): readonly PrimeFactorStep[] {
  const steps: PrimeFactorStep[] = [];
  const sortedFactors = [...factors.entries()].sort(([primeA], [primeB]) =>
    primeA < primeB ? -1 : primeA > primeB ? 1 : 0,
  );

  for (const [prime, exponent] of sortedFactors) {
    const direction: 1 | -1 = exponent > 0 ? 1 : -1;

    for (let count = 0; count < Math.abs(exponent); count++) {
      steps.push({ prime, direction });
    }
  }

  return steps;
}
