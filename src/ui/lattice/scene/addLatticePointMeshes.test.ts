import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { addLatticePointMeshes } from "./addLatticePointMeshes";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";

vi.mock("./createLatticePointLabelSprite", () => ({
  createLatticePointLabelSprite: vi.fn(() => new THREE.Sprite()),
}));

describe("addLatticePointMeshes", () => {
  it("adds a mesh for each scene point", () => {
    const scene = new THREE.Scene();
    const ratio1 = createTestRatio(3n, 2n);
    const ratio2 = createTestRatio(5n, 4n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: ratio1,
        labelRatio: ratio1,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
      {
        id: "ratio-2",
        rawInput: "5/4",
        ratio: ratio2,
        labelRatio: ratio2,
        position: { x: 0, y: 1, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    addLatticePointMeshes(scene, scenePoints);

    expect(scene.children).toHaveLength(2);
    expect(scene.children[0]?.userData.latticeScenePointId).toBe("ratio-1");
    expect(scene.children[1]?.userData.latticeScenePointId).toBe("ratio-2");
  });

  it("returns the meshes it adds to the scene", () => {
    const scene = new THREE.Scene();
    const ratio1 = createTestRatio(3n, 2n);
    const ratio2 = createTestRatio(5n, 4n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: ratio1,
        labelRatio: ratio1,
        position: { x: 1, y: 2, z: 3 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
      {
        id: "ratio-2",
        rawInput: "5/4",
        ratio: ratio2,
        labelRatio: ratio2,
        position: { x: 4, y: 5, z: 6 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const meshes = addLatticePointMeshes(scene, scenePoints);

    expect(scene.children).toHaveLength(2);
    expect(meshes[0]).toBe(scene.children[0]);
    expect(meshes[1]).toBe(scene.children[1]);
  });

  it("uses a supplied colour for higher-prime point meshes", () => {
    const scene = new THREE.Scene();
    const ratio = createTestRatio(11n, 8n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "11/8",
        ratio,
        labelRatio: ratio,
        position: { x: 1, y: 2, z: 3 },
        hasHigherPrimeFactors: true,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const meshes = addLatticePointMeshes(scene, scenePoints, {
      higherPrimeColor: "purple",
    });

    const mesh = meshes[0];

    if (!mesh) throw new Error("Expected a point mesh");

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("purple"));
  });

  it("keeps ordinary point meshes red when a higher-prime color is supplied", () => {
    const scene = new THREE.Scene();
    const ratio = createTestRatio(3n, 2n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio,
        labelRatio: ratio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const meshes = addLatticePointMeshes(scene, scenePoints, {
      higherPrimeColor: "purple",
    });

    const mesh = meshes[0];

    if (!mesh) throw new Error("Expected a point mesh");

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("red"));
  });
});
