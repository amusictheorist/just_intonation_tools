import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { createLatticePointMesh } from "./createLatticePointMesh";

export function addLatticePointMeshes(
  scene: THREE.Scene,
  scenePoints: readonly LatticeScenePoint[],
): readonly THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];

  for (const scenePoint of scenePoints) {
    const mesh = createLatticePointMesh(scenePoint);

    scene.add(mesh);
    meshes.push(mesh);
  }

  return meshes;
}
