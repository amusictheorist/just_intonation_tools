import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";

export function createLatticePointMesh(
  scenePoint: LatticeScenePoint,
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshStandardMaterial();

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(
    scenePoint.position.x,
    scenePoint.position.y,
    scenePoint.position.z,
  );

  mesh.userData.latticeScenePointId = scenePoint.id;

  return mesh;
}
