import type { PrimeExponents } from "../symbolic/primeExponents";
import { findDifferingPrime } from "./findDifferingPrime";

export function arePrimeExponentPositionsAxisAligned(
  first: PrimeExponents,
  second: PrimeExponents,
): boolean {
  return findDifferingPrime(first, second) !== null;
}
