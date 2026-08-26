import type { ExpandedCubicAddress } from "../../symbolic/createExpandedCubicAddress";
import { createHigherPrimeExponents } from "../createHigherPrimeExponents";
import { isPrimeAxisConnectionVisible } from "../isPrimeAxisConnectionVisible";

function hasSameLocalCoordinates(
  first: ExpandedCubicAddress,
  second: ExpandedCubicAddress,
): boolean {
  return (
    first.coordinates357.x === second.coordinates357.x &&
    first.coordinates357.y === second.coordinates357.y &&
    first.coordinates357.z === second.coordinates357.z
  );
}

export function isExpandedCubicHigherPrimeConnectionVisible(
  first: ExpandedCubicAddress,
  second: ExpandedCubicAddress,
  others: readonly ExpandedCubicAddress[],
): boolean {
  if (!hasSameLocalCoordinates(first, second)) return false;

  const relevantOthers = others.filter((other) =>
    hasSameLocalCoordinates(first, other),
  );

  return isPrimeAxisConnectionVisible(
    createHigherPrimeExponents(first),
    createHigherPrimeExponents(second),
    relevantOthers.map(createHigherPrimeExponents),
  );
}
