import type { PositionedLatticeRatio } from "../state/createPositionedLatticeRatios";
import type { LatticeScenePoint } from "./latticeScenePoint";

export function createLatticeScenePoint(
  positionedRatio: PositionedLatticeRatio,
): LatticeScenePoint {
  return {
    id: positionedRatio.latticeRatio.id,
    position: positionedRatio.position,
  };
}
