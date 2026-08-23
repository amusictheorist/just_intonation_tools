import * as THREE from "three";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import { DEFAULT_LATTICE_CONNECTION_COLOR } from "./latticeConnectionStyle";

/**
 * Creates a Three.js line for a lattice scene connection.
 *
 * @param connection The scene connection whose endpoints define the line.
 * @returns A Three.js line with endpoint metadata stored in `userData`.
 */

export function createLatticeConnectionLine(
  connection: LatticeSceneConnection,
): THREE.Line {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(
      connection.fromPosition.x,
      connection.fromPosition.y,
      connection.fromPosition.z,
    ),
    new THREE.Vector3(
      connection.toPosition.x,
      connection.toPosition.y,
      connection.toPosition.z,
    ),
  ]);

  const material = new THREE.LineBasicMaterial({
    color: DEFAULT_LATTICE_CONNECTION_COLOR,
  });
  const line = new THREE.Line(geometry, material);

  line.userData.fromLatticeScenePointId = connection.fromId;
  line.userData.toLatticeScenePointId = connection.toId;

  return line;
}
