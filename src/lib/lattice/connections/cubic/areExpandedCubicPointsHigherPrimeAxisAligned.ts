import type { ExpandedCubicAddress } from "../../symbolic/cubic/createExpandedCubicAddress";
import { arePrimeExponentPositionsAxisAligned } from "../arePrimeExponentPositionsAxisAligned";
import { createHigherPrimeExponents } from "../createHigherPrimeExponents";

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

  return arePrimeExponentPositionsAxisAligned(
    createHigherPrimeExponents(first),
    createHigherPrimeExponents(second),
  );
}
