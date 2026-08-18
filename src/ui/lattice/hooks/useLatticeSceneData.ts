import { useMemo } from "react";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import type { PositionedLatticeRatio } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import { createLatticeScenePoints } from "../../../lib/lattice/presentation/createLatticeScenePoints";
import { createLatticeConnections } from "../../../lib/lattice/connections/createLatticeConnections";
import { createLatticeSceneConnections } from "../../../lib/lattice/presentation/createLatticeSceneConnections";

type UseLatticeSceneDataResult = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
};

export function useLatticeSceneData(
  positionedRatios: readonly PositionedLatticeRatio[],
): UseLatticeSceneDataResult {
  return useMemo(() => {
    const scenePoints = createLatticeScenePoints(positionedRatios);
    const connections = createLatticeConnections(positionedRatios);
    const sceneConnections = createLatticeSceneConnections(
      connections,
      scenePoints,
    );

    return { scenePoints, sceneConnections };
  }, [positionedRatios]);
}
