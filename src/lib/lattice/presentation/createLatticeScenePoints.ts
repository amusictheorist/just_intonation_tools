import type { PositionedLatticeRatio } from "../state/createPositionedLatticeRatios";
import { createLatticeScenePoint } from "./createLatticeScenePoint";
import type { LatticeScenePoint } from "./latticeScenePoint";

export function createLatticeScenePoints(
  positionedRatios: readonly PositionedLatticeRatio[],
): readonly LatticeScenePoint[] {
  return positionedRatios.map(createLatticeScenePoint);
}
