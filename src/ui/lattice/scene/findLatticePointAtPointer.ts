import * as THREE from "three";

export type PointerCoordinates = Readonly<{
  clientX: number;
  clientY: number;
}>;

/**
 * Finds the lattice point mesh under a pointer position.
 *
 * @param event The pointer event whose viewport coordinates should be tested.
 * @param canvas The canvas whose bounds define normalized pointer coordinates.
 * @param camera The camera through which the lattice scene is viewed.
 * @param pointMeshes The Lattice point meshes eligible for intersection.
 * @returns The intersected lattice scene point id, or null when no point is hit.
 */

export function findLatticePointAtPointer(
  event: PointerCoordinates,
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  pointMeshes: readonly THREE.Mesh[],
): string | null {
  const bounds = canvas.getBoundingClientRect();

  const pointer = new THREE.Vector2(
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
  );

  const raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(pointer, camera);

  const intersections = raycaster.intersectObjects([...pointMeshes], false);
  const firstIntersection = intersections[0];

  if (!firstIntersection) return null;

  const id = firstIntersection.object.userData.latticeScenePointId;

  return typeof id === "string" ? id : null;
}
