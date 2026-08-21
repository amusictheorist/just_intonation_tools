import { useMemo } from "react";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import type { PositionedLatticeRatio } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import { createLatticeScenePoints } from "../../../lib/lattice/presentation/createLatticeScenePoints";
import { createLatticeConnections } from "../../../lib/lattice/connections/createLatticeConnections";
import { createLatticeSceneConnections } from "../../../lib/lattice/presentation/createLatticeSceneConnections";
import {
  filterLatticeConnections,
  type LatticeConnectionVisibility,
} from "../../../lib/lattice/connections/filterLatticeConnections";
import { createAvailableConnectionPrimes } from "../../../lib/lattice/connections/createAvailableConnectionPrimes";

type UseLatticeSceneDataResult = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
  availableConnectionPrimes: readonly bigint[];
};

export function useLatticeSceneData(
  positionedRatios: readonly PositionedLatticeRatio[],
  connectionVisibility: LatticeConnectionVisibility,
): UseLatticeSceneDataResult {
  return useMemo(() => {
    const scenePoints = createLatticeScenePoints(positionedRatios);
    const connections = createLatticeConnections(positionedRatios);
    const availableConnectionPrimes =
      createAvailableConnectionPrimes(connections);

    const visibleConnections = filterLatticeConnections(
      connections,
      connectionVisibility,
    );
    const sceneConnections = createLatticeSceneConnections(
      visibleConnections,
      scenePoints,
    );

    return { scenePoints, sceneConnections, availableConnectionPrimes };
  }, [positionedRatios, connectionVisibility]);
}
