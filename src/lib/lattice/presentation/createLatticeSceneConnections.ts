import type { LatticeConnection } from "../connections/latticeConnection";
import { createLatticeSceneConnection } from "./createLatticeSceneConnection";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import type { LatticeScenePoint } from "./latticeScenePoint";

export function createLatticeSceneConnections(
  connections: readonly LatticeConnection[],
  scenePoints: readonly LatticeScenePoint[],
): readonly LatticeSceneConnection[] {
  return connections.map((connection) =>
    createLatticeSceneConnection(connection, scenePoints),
  );
}
