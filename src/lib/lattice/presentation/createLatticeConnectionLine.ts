import * as THREE from "three";
import type { LatticeSceneConnection } from "./latticeSceneConnection";

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

  const material = new THREE.LineBasicMaterial();
  const line = new THREE.Line(geometry, material);

  line.userData.fromLatticeScenePointId = connection.fromId;
  line.userData.toLatticeScenePointId = connection.toId;

  return line;
}
