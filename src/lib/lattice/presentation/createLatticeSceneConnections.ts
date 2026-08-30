import type { LatticeConnection } from "../connections/latticeConnection";
import { createLatticeSceneConnection } from "./createLatticeSceneConnection";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import type { LatticeScenePoint } from "./latticeScenePoint";

/**
 * Resolves lattice connections into renderer-ready scene connections.
 *
 * @param connections The lattice connections to resolve.
 * @param scenePoints The scene points used to resolve connection endpoints.
 * @returns The scene connections in the same order as the input connections.
 * @throws If any connection references a missing scene point.
 */

export function createLatticeSceneConnections(
  connections: readonly LatticeConnection[],
  scenePoints: readonly LatticeScenePoint[],
): readonly LatticeSceneConnection[] {
  return connections.map((connection) =>
    createLatticeSceneConnection(connection, scenePoints),
  );
}
