import { describe, expect, it } from "vitest";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { createLatticePointMesh } from "./createLatticePointMesh";

describe("createLatticePointMesh", () => {
  it("creates a mesh at the scene point position", () => {
    const scenePoint = {
      id: "ratio-1",
      position: { x: 12, y: -7, z: 31 },
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    expect(mesh.position.x).toBe(12);
    expect(mesh.position.y).toBe(-7);
    expect(mesh.position.z).toBe(31);
  });

  it("stoes the scene point id on the mesh", () => {
    const scenePoint = {
      id: "ratio-2",
      position: { x: 0, y: 1, z: 0 },
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    expect(mesh.userData.latticeScenePointId).toBe("ratio-2");
  });
});
