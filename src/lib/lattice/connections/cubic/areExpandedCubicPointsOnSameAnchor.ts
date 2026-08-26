import type { ExpandedCubicAddress } from "../../symbolic/cubic/createExpandedCubicAddress";

export function areExpandedCubicPointsOnSameAnchor(
  first: ExpandedCubicAddress,
  second: ExpandedCubicAddress,
): boolean {
  if (first.anchorPath.length !== second.anchorPath.length) return false;

  return first.anchorPath.every((step, index) => {
    const otherStep = second.anchorPath[index];

    return (
      step.prime === otherStep.prime && step.direction === otherStep.direction
    );
  });
}
