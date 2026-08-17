import * as THREE from "three";
import { describe, expect, it } from "vitest";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { addLatticePointMeshes } from "./addLatticePointMeshes";

describe("addLatticePointMeshes", () => {
  it("adds a mesh for each scene point", () => {
    const scene = new THREE.Scene();

    const scenePoints = [
      {
        id: "ratio-1",
        position: { x: 1, y: 0, z: 0 },
      },
      {
        id: "ratio-2",
        position: { x: 0, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeScenePoint[];

    addLatticePointMeshes(scene, scenePoints);

    expect(scene.children).toHaveLength(2);
    expect(scene.children[0]?.userData.latticeScenePointId).toBe("ratio-1");
    expect(scene.children[1]?.userData.latticeScenePointId).toBe("ratio-2");
  });

  it("returns the meshes it adds to the scene", () => {
    const scene = new THREE.Scene();

    const scenePoints = [
      {
        id: "ratio-1",
        position: { x: 1, y: 2, z: 3 },
      },
      {
        id: "ratio-2",
        position: { x: 4, y: 5, z: 6 },
      },
    ] satisfies readonly LatticeScenePoint[];

    const meshes = addLatticePointMeshes(scene, scenePoints);

    expect(scene.children).toHaveLength(2);
    expect(meshes[0]).toBe(scene.children[0]);
    expect(meshes[1]).toBe(scene.children[1]);
  });
});
