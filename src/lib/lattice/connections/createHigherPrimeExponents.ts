import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";
import { createPrimeExponents } from "./createPrimeExponents";

export function createHigherPrimeExponents(
  address: ExpandedCubicAddress,
): Map<bigint, number> {
  return createPrimeExponents(address.anchorPath);
}
