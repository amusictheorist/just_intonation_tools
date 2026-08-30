import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { createLatticePointMesh } from "./createLatticePointMesh";

type AddLatticePointMeshesOptions = Readonly<{
  higherPrimeColor?: THREE.ColorRepresentation;
}>;

/**
 * Creates and adds point meshes for the supplied lattice scene points.
 *
 * @param scene The Three.js scene that receives the point meshes.
 * @param scenePoints The scene points to render.
 * @param options Optional point-mesh appearance settings.
 * @returns The point meshes added to the scene, in input order.
 */

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
