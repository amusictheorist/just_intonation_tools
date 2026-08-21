import type { PrimeExponents } from "../symbolic/primeExponents";
import { findDifferingPrime } from "./findDifferingPrime";

function liesBetweenOnPrimeAxis(
  reference: PrimeExponents,
  other: PrimeExponents,
  prime: bigint,
  firstExponent: number,
  secondExponent: number,
): boolean {
  const primes = new Set([...reference.keys(), ...other.keys()]);

  for (const candidatePrime of primes) {
    if (candidatePrime === prime) continue;

    if (
      (reference.get(candidatePrime) ?? 0) !== (other.get(candidatePrime) ?? 0)
    )
      return false;
  }

  const otherExponent = other.get(prime) ?? 0;

  return (
    otherExponent > Math.min(firstExponent, secondExponent) &&
    otherExponent < Math.max(firstExponent, secondExponent)
  );
}

/**
 * Determines whether two prime-exponent positions should be connected.
 *
 * A connection is visible when the positions differ along exactly one prime axis and no other displayed position lies strictly between them on that axis.
 *
 * @param first Map of prime exponents.
 * @param second Map of prime exponents
 * @param others Map of surrounding prime exponents.
 * @returns Whether a connection is visible along a prime axis or not.
 */

export function isPrimeAxisConnectionVisible(
  first: PrimeExponents,
  second: PrimeExponents,
  others: readonly PrimeExponents[],
): boolean {
  const prime = findDifferingPrime(first, second);

  if (prime === null) return false;

  const firstExponent = first.get(prime) ?? 0;
  const secondExponent = second.get(prime) ?? 0;

  return !others.some((other) =>
    liesBetweenOnPrimeAxis(first, other, prime, firstExponent, secondExponent),
  );
}
