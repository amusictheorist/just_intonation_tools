import { arePrimeExponentPositionsAxisAligned } from "./arePrimeExponentPositionsAxisAligned";
import { findDifferingPrime } from "./findDifferingPrime";

function liesBetweenOnPrimeAxis(
  reference: ReadonlyMap<bigint, number>,
  other: ReadonlyMap<bigint, number>,
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

export function isPrimeAxisConnectionVisible(
  first: ReadonlyMap<bigint, number>,
  second: ReadonlyMap<bigint, number>,
  others: readonly ReadonlyMap<bigint, number>[],
): boolean {
  if (!arePrimeExponentPositionsAxisAligned(first, second)) return false;

  const prime = findDifferingPrime(first, second);

  if (prime === null) return false;

  const firstExponent = first.get(prime) ?? 0;
  const secondExponent = second.get(prime) ?? 0;

  return !others.some((other) =>
    liesBetweenOnPrimeAxis(first, other, prime, firstExponent, secondExponent),
  );
}
