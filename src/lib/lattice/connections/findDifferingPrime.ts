export function findDifferingPrime(
  first: ReadonlyMap<bigint, number>,
  second: ReadonlyMap<bigint, number>,
): bigint | null {
  const primes = new Set([...first.keys(), ...second.keys()]);
  let differingPrime: bigint | null = null;

  for (const prime of primes) {
    if ((first.get(prime) ?? 0) === (second.get(prime) ?? 0)) continue;

    if (differingPrime !== null) return null;

    differingPrime = prime;
  }

  return differingPrime;
}
