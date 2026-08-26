import type { ExpandedCubicAddress } from "../../symbolic/createExpandedCubicAddress";
import { areExpandedCubicPointsOnSameAnchor } from "./areExpandedCubicPointsOnSameAnchor";
import { isStandardCubicConnectionVisible } from "./isStandardCubicConnectionVisible";

export function isExpandedCubicLocalConnectionVisible(
  first: ExpandedCubicAddress,
  second: ExpandedCubicAddress,
  others: readonly ExpandedCubicAddress[],
): boolean {
  if (!areExpandedCubicPointsOnSameAnchor(first, second)) return false;

  const otherCoordinatesAtAnchor = others
    .filter((other) => areExpandedCubicPointsOnSameAnchor(first, other))
    .map((other) => other.coordinates357);

  return isStandardCubicConnectionVisible(
    first.coordinates357,
    second.coordinates357,
    otherCoordinatesAtAnchor,
  );
}
