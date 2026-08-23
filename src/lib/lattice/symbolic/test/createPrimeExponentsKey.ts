import { comparePrimesAscending } from "../comparePrimesAscending";
import type { PrimeExponents } from "../primeExponents";

export function createPrimeExponentsKey(exponents: PrimeExponents): string {
  return [...exponents.entries()]
    .sort(([firstPrime], [secondPrime]) =>
      comparePrimesAscending(firstPrime, secondPrime),
    )
    .map(([prime, exponent]) => `${prime}:${exponent}`)
    .join(",");
}
