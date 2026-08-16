import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";

export function createHigherPrimeExponents(
  address: ExpandedCubicAddress,
): Map<bigint, number> {
  const exponents = new Map<bigint, number>();

  for (const step of address.anchorPath) {
    exponents.set(
      step.prime,
      (exponents.get(step.prime) ?? 0) + step.direction,
    );
  }

  return exponents;
}

export function areExpandedCubicPointsHigherPrimeAxisAligned(
  first: ExpandedCubicAddress,
  second: ExpandedCubicAddress,
): boolean {
  if (
    first.coordinates357.x !== second.coordinates357.x ||
    first.coordinates357.y !== second.coordinates357.y ||
    first.coordinates357.z !== second.coordinates357.z
  )
    return false;

  const firstExponents = createHigherPrimeExponents(first);
  const secondExponents = createHigherPrimeExponents(second);

  const primes = new Set([...firstExponents.keys(), ...secondExponents.keys()]);

  let differingPrimes = 0;

  for (const prime of primes) {
    if ((firstExponents.get(prime) ?? 0) !== (secondExponents.get(prime) ?? 0))
      differingPrimes++;
  }

  return differingPrimes === 1;
}
