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

  const radialVariant = placement.variant;

  if (radialVariant.type === "standard")
    return normalizeLatticeLabelRatio(latticeRatio.ratio);

  return radialVariant.address.normalizedRatio;
}

function hasHigherPrimeFactors(
  placement: PositionedLatticeRatio["placement"],
): boolean {
  if (placement.type === "cubic") {
    if (placement.variant.type === "standard") return false;

    return placement.variant.address.anchorPath.length > 0;
  }

  return placement.variant.address.path.some(({ prime }) => prime > 7n);
}

function getRadialSide(
  placement: PositionedLatticeRatio["placement"],
): "upper" | "lower" | null {
  if (placement.type !== "radial") return null;

  const radialVariant = placement.variant;

  if (radialVariant.type === "standard") return null;

  return radialVariant.address.side;
}
