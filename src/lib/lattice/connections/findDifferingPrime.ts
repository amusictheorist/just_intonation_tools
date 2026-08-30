import type { PrimeExponents } from "../symbolic/primeExponents";

export function findDifferingPrime(
  first: PrimeExponents,
  second: PrimeExponents,
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
