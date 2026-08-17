import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";
import { areExpandedCubicPointsHigherPrimeAxisAligned } from "./areExpandedCubicPointsHigherPrimeAxisAligned";
import { createHigherPrimeExponents } from "./createHigherPrimeExponents";

function findDifferingPrime(
  first: ReadonlyMap<bigint, number>,
  second: ReadonlyMap<bigint, number>,
): bigint | null {
  const primes = new Set([...first.keys(), ...second.keys()]);

  for (const prime of primes) {
    if ((first.get(prime) ?? 0) !== (second.get(prime) ?? 0)) return prime;
  }

  return null;
}

function liesBetweenOnHigherPrimeAxis(
  reference: ExpandedCubicAddress,
  other: ExpandedCubicAddress,
  prime: bigint,
  firstExponent: number,
  secondExponent: number,
): boolean {
  if (
    other.coordinates357.x !== reference.coordinates357.x ||
    other.coordinates357.y !== reference.coordinates357.y ||
    other.coordinates357.z !== reference.coordinates357.z
  )
    return false;

  const referenceExponents = createHigherPrimeExponents(reference);
  const otherExponents = createHigherPrimeExponents(other);

  const primes = new Set([
    ...referenceExponents.keys(),
    ...otherExponents.keys(),
  ]);

  for (const candidatePrime of primes) {
    if (candidatePrime === prime) continue;

    if (
      (referenceExponents.get(candidatePrime) ?? 0) !==
      (otherExponents.get(candidatePrime) ?? 0)
    )
      return false;
  }

  const otherExponent = otherExponents.get(prime) ?? 0;

  return (
    otherExponent > Math.min(firstExponent, secondExponent) &&
    otherExponent < Math.max(firstExponent, secondExponent)
  );
}

export function isExpandedCubicHigherPrimeConnectionVisible(
  first: ExpandedCubicAddress,
  second: ExpandedCubicAddress,
  others: readonly ExpandedCubicAddress[],
): boolean {
  if (!areExpandedCubicPointsHigherPrimeAxisAligned(first, second))
    return false;

  const firstExponents = createHigherPrimeExponents(first);
  const secondExponents = createHigherPrimeExponents(second);

  const prime = findDifferingPrime(firstExponents, secondExponents);

  if (prime === null) return false;

  const firstExponent = firstExponents.get(prime) ?? 0;
  const secondExponent = secondExponents.get(prime) ?? 0;

  return !others.some((other) =>
    liesBetweenOnHigherPrimeAxis(
      first,
      other,
      prime,
      firstExponent,
      secondExponent,
    ),
  );
}
