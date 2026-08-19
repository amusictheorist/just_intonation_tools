import type { PositionedLatticeRatio } from "../state/createPositionedLatticeRatios";
import type { LatticeScenePoint } from "./latticeScenePoint";
import { normalizeLatticeLabelRatio } from "./normalizeLatticeLabelRatio";

export function createLatticeScenePoint(
  positionedRatio: PositionedLatticeRatio,
): LatticeScenePoint {
  const { latticeRatio, placement, position } = positionedRatio;

  return {
    id: latticeRatio.id,
    rawInput: latticeRatio.rawInput,
    ratio: latticeRatio.ratio,
    labelRatio: getLabelRatio(positionedRatio),
    position,
    hasHigherPrimeFactors: hasHigherPrimeFactors(placement),
    radialSide: getRadialSide(placement),
  };
}

function getLabelRatio(
  positionedRatio: PositionedLatticeRatio,
): LatticeScenePoint["labelRatio"] {
  const { latticeRatio, placement } = positionedRatio;

  if (placement.type !== "radial")
    return normalizeLatticeLabelRatio(latticeRatio.ratio);

  const radialPlacement = placement.placement;

  if (radialPlacement.type === "standard")
    return normalizeLatticeLabelRatio(latticeRatio.ratio);

  return radialPlacement.address.normalizedRatio;
}

function hasHigherPrimeFactors(
  placement: PositionedLatticeRatio["placement"],
): boolean {
  if (placement.type === "cubic") {
    if (placement.placement.type === "standard") return false;

    return placement.placement.address.anchorPath.length > 0;
  }

  return placement.placement.address.path.some(({ prime }) => prime > 7n);
}

function getRadialSide(
  placement: PositionedLatticeRatio["placement"],
): "upper" | "lower" | null {
  if (placement.type !== "radial") return null;

  const radialPlacement = placement.placement;

  if (radialPlacement.type === "standard") return null;

  return radialPlacement.address.side;
}
