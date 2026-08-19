import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { createLatticePointMesh } from "./createLatticePointMesh";

type AddLatticePointMeshesOptions = Readonly<{
  higherPrimeColor?: THREE.ColorRepresentation;
}>;

export function addLatticePointMeshes(
  scene: THREE.Scene,
  scenePoints: readonly LatticeScenePoint[],
  options: AddLatticePointMeshesOptions = {},
): readonly THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];

  for (const scenePoint of scenePoints) {
    const mesh = createLatticePointMesh(scenePoint, options);

    scene.add(mesh);
    meshes.push(mesh);
  }

  return meshes;
}
