import type { Ratio } from "../../ji/ratio";
import type { PrimeExponents } from "./primeExponents";

function factorIntegerIgnoringTwo(input: bigint): Map<bigint, number> {
  const factors = new Map<bigint, number>();
  let value = input;

  while (value % 2n === 0n) value /= 2n;

  let divisor = 3n;

  while (divisor * divisor <= value) {
    while (value % divisor === 0n) {
      factors.set(divisor, (factors.get(divisor) ?? 0) + 1);
      value /= divisor;
    }

    divisor += 2n;
  }

  if (value > 1n) factors.set(value, (factors.get(value) ?? 0) + 1);

  return factors;
}

function mergePrimeExponents(
  numeratorFactors: PrimeExponents,
  denominatorFactors: PrimeExponents,
): PrimeExponents {
  const result = new Map<bigint, number>();

  for (const [prime, exponent] of numeratorFactors) result.set(prime, exponent);
  for (const [prime, exponent] of denominatorFactors)
    result.set(prime, (result.get(prime) ?? 0) - exponent);

  for (const [prime, exponent] of result) {
    if (exponent === 0) result.delete(prime);
  }

  return result;
}

/**
 * Factors an exact ratio into signed prime exponents while ignoring powers of 2.
 *
 * Each remaining prime records its net exponent across the numerator and denominator. Numerator factors are positive, denominator factors are negative, and factors that cancel completely are omitted.
 *
 * Ignoring powers of 2 makes octave-equivalent ratios produce the same symbolic prime-factor structure for lattice placement.
 *
 * @param ratio A validated ratio from the shared JI domain.
 * @returns A map of prime exponents.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function factorPrimesIgnoringTwo(ratio: Ratio): PrimeExponents {
  return mergePrimeExponents(
    factorIntegerIgnoringTwo(ratio.numerator),
    factorIntegerIgnoringTwo(ratio.denominator),
  );
}
