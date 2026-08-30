import type { ExpandedCubicAddress } from "../symbolic/cubic/createExpandedCubicAddress";
import type { PrimeExponents } from "../symbolic/primeExponents";
import { createPrimeExponents } from "./createPrimeExponents";

export function createHigherPrimeExponents(
  address: ExpandedCubicAddress,
): PrimeExponents {
  return createPrimeExponents(address.anchorPath);
}
