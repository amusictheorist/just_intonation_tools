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
