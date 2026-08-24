import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { createLatticePointMesh } from "./createLatticePointMesh";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import { createLatticePointLabelSprite } from "./createLatticePointLabelSprite";

vi.mock("./createLatticePointLabelSprite", () => ({
  createLatticePointLabelSprite: vi.fn(() => new THREE.Sprite()),
}));

describe("createLatticePointMesh", () => {
  it("creates a mesh at the scene point position", () => {
    const ratio = createTestRatio(3n, 2n);

    const scenePoint = {
      id: "ratio-1",
      rawInput: "3/2",
      ratio,
      labelRatio: ratio,
      position: { x: 12, y: -7, z: 31 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    expect(mesh.position.x).toBe(12);
    expect(mesh.position.y).toBe(-7);
    expect(mesh.position.z).toBe(31);
  });

  it("stores the scene point id on the mesh", () => {
    const ratio = createTestRatio(5n, 4n);

    const scenePoint = {
      id: "ratio-2",
      rawInput: "5/4",
      ratio,
      labelRatio: ratio,
      position: { x: 0, y: 1, z: 0 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    expect(mesh.userData.latticeScenePointId).toBe("ratio-2");
  });

  it("adds a label above the point mesh", () => {
    const ratio = createTestRatio(3n, 2n);

    const scenePoint = {
      id: "ratio-1",
      rawInput: "3/1",
      ratio: createTestRatio(3n, 1n),
      labelRatio: ratio,
      position: { x: 0, y: 0, z: 0 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    expect(mesh.children).toHaveLength(1);

    const label = mesh.children[0];

    expect(label).toBeInstanceOf(THREE.Sprite);
    expect(label?.position.x).toBe(0);
    expect(label?.position.y).toBe(0.4);
    expect(label?.position.z).toBe(0);
  });

  it("creates the point label from the normalized label ratio", () => {
    const scenePoint = {
      id: "ratio-1",
      rawInput: "3/1",
      ratio: createTestRatio(3n, 1n),
      labelRatio: createTestRatio(3n, 2n),
      position: { x: 1, y: 0, z: 0 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    } satisfies LatticeScenePoint;

    createLatticePointMesh(scenePoint);

    expect(createLatticePointLabelSprite).toHaveBeenCalledWith("3/2");
  });

  it("uses red for an ordinary lattice point", () => {
    const ratio = createTestRatio(3n, 2n);

    const scenePoint = {
      id: "ratio-1",
      rawInput: "3/2",
      ratio,
      labelRatio: ratio,
      position: { x: 1, y: 0, z: 0 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a single point-mesh material");
    }

    expect(material.color).toEqual(new THREE.Color("red"));
  });

  it("uses dark blue for a higher-prime lattice point", () => {
    const ratio = createTestRatio(11n, 8n);

    const scenePoint = {
      id: "ratio-1",
      rawInput: "11/8",
      ratio,
      labelRatio: ratio,
      position: { x: 1, y: 0, z: 0 },
      hasHigherPrimeFactors: true,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a single point-mesh material");
    }

    expect(material.color).toEqual(new THREE.Color("#00008b"));
  });

  it("uses a supplied colour for a higher-prime lattice point", () => {
    const ratio = createTestRatio(11n, 8n);

    const scenePoint = {
      id: "ratio-1",
      rawInput: "11/8",
      ratio,
      labelRatio: ratio,
      position: { x: 0, y: 0, z: 0 },
      hasHigherPrimeFactors: true,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint, {
      higherPrimeColor: "purple",
    });

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("purple"));
  });

  it("keeps an ordinary lattice point red when a higher-prime colour is supplied", () => {
    const ratio = createTestRatio(3n, 2n);

    const scenePoint = {
      id: "ratio-1",
      rawInput: "3/2",
      ratio,
      labelRatio: ratio,
      position: { x: 1, y: 0, z: 0 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint, {
      higherPrimeColor: "purple",
    });

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("red"));
  });

  it("stores whether the scene point has higher-prime factors", () => {
    const ratio = createTestRatio(11n, 8n);

    const scenePoint = {
      id: "ratio-1",
      rawInput: "11/8",
      ratio,
      labelRatio: ratio,
      position: { x: 0, y: 0, z: 0 },
      hasHigherPrimeFactors: true,
      radialSide: null,
    } satisfies LatticeScenePoint;

    const mesh = createLatticePointMesh(scenePoint);

    expect(mesh.userData.hasHigherPrimeFactors).toBe(true);
  });
});
