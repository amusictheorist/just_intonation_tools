import type { LatticeConnection } from "../connections/latticeConnection";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import type { LatticeScenePoint } from "./latticeScenePoint";

export function createLatticeSceneConnection(
  connection: LatticeConnection,
  scenePoints: readonly LatticeScenePoint[],
): LatticeSceneConnection {
  const fromPoint = scenePoints.find((point) => point.id === connection.fromId);
  const toPoint = scenePoints.find((point) => point.id === connection.toId);

  if (!fromPoint) {
    throw new Error(
      `Missing scene point for connection source: ${connection.fromId}`,
    );
  }

  if (!toPoint) {
    throw new Error(
      `Missing scene point for connection target: ${connection.toId}`,
    );
  }

  return {
    fromId: connection.fromId,
    toId: connection.toId,
    fromPosition: fromPoint.position,
    toPosition: toPoint.position,
  };
}
