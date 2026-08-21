import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";

export function createPrimeExponents(
  path: readonly PrimeFactorStep[],
): Map<bigint, number> {
  const exponents = new Map<bigint, number>();

  for (const step of path) {
    const exponent = (exponents.get(step.prime) ?? 0) + step.direction;

    if (exponent === 0) {
      exponents.delete(step.prime);
      continue;
    }

    exponents.set(step.prime, exponent);
  }

  return exponents;
}
