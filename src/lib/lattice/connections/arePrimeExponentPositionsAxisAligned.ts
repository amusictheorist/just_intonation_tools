export function arePrimeExponentPositionsAxisAligned(
  first: ReadonlyMap<bigint, number>,
  second: ReadonlyMap<bigint, number>,
): boolean {
  const primes = new Set([...first.keys(), ...second.keys()]);
  let differingPrimeCount = 0;

  for (const prime of primes) {
    const firstExponent = first.get(prime) ?? 0;
    const secondExponent = second.get(prime) ?? 0;

    if (firstExponent === secondExponent) continue;

    differingPrimeCount++;

    if (differingPrimeCount > 1) return false;
  }

  return differingPrimeCount === 1;
}
