import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { LatticeSceneRenderer } from "./LatticeSceneRenderer";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import { createLatticePointLabelSprite } from "./createLatticePointLabelSprite";

vi.mock("./createLatticePointLabelSprite", () => ({
  createLatticePointLabelSprite: vi.fn(() => new THREE.Sprite()),
}));

describe("LatticeSceneRenderer", () => {
  it("adds scene-point meshes to its scene", () => {
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

    const renderer = new LatticeSceneRenderer(scenePoints);

    const pointMeshes = renderer.scene.children.filter(
      (child): child is THREE.Mesh => child instanceof THREE.Mesh,
    );

    expect(pointMeshes).toHaveLength(2);
    expect(pointMeshes[0]?.userData.latticeScenePointId).toBe("ratio-1");
    expect(pointMeshes[1]?.userData.latticeScenePointId).toBe("ratio-2");
  });

  it("stores the point meshes it creates", () => {
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

    const renderer = new LatticeSceneRenderer(scenePoints);

    const pointMeshes = renderer.scene.children.filter(
      (child): child is THREE.Mesh => child instanceof THREE.Mesh,
    );

    expect(pointMeshes).toHaveLength(2);
    expect(renderer.scene.children).toContain(renderer.pointMeshes[0]);
    expect(renderer.scene.children).toContain(renderer.pointMeshes[1]);
  });

  it("disposes its point mesh resources", () => {
    const ratio = createTestRatio(3n, 2n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: ratio,
        labelRatio: ratio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const renderer = new LatticeSceneRenderer(scenePoints);

    const mesh = renderer.pointMeshes[0];
    if (!mesh) throw new Error("Expected point mesh");

    const material = mesh.material;

    if (Array.isArray(material)) {
      throw new Error("Expected a single point-mesh material");
    }

    const geometryDispose = vi.spyOn(mesh.geometry, "dispose");
    const materialDispose = vi.spyOn(material, "dispose");

    renderer.dispose();

    expect(geometryDispose).toHaveBeenCalledOnce();
    expect(materialDispose).toHaveBeenCalledOnce();
    expect(
      renderer.scene.children.filter((child) => child instanceof THREE.Mesh),
    ).toHaveLength(0);
  });

  it("replaces its point meshes when scene points change", () => {
    const initialRatio = createTestRatio(3n, 2n);

    const initialScenePoints = [
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: initialRatio,
        labelRatio: initialRatio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const ratio2 = createTestRatio(5n, 4n);
    const ratio3 = createTestRatio(7n, 4n);

    const nextScenePoints = [
      {
        id: "ratio-2",
        rawInput: "5/4",
        ratio: ratio2,
        labelRatio: ratio2,
        position: { x: 0, y: 1, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
      {
        id: "ratio-3",
        rawInput: "5/4",
        ratio: ratio3,
        labelRatio: ratio3,
        position: { x: 0, y: 0, z: 1 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const renderer = new LatticeSceneRenderer(initialScenePoints);

    const oldMesh = renderer.pointMeshes[0];
    if (!oldMesh) throw new Error("Expected initial point mesh");

    const geometryDispose = vi.spyOn(oldMesh.geometry, "dispose");

    renderer.setScene(nextScenePoints, []);

    expect(geometryDispose).toHaveBeenCalledOnce();

    expect(renderer.pointMeshes).toHaveLength(2);
    expect(renderer.pointMeshes[0]?.userData.latticeScenePointId).toBe(
      "ratio-2",
    );
    expect(renderer.pointMeshes[1]?.userData.latticeScenePointId).toBe(
      "ratio-3",
    );

    expect(
      renderer.scene.children.filter((child) => child instanceof THREE.Mesh),
    ).toHaveLength(2);
    expect(renderer.scene.children).not.toContain(oldMesh);
  });

  it("adds connection lines to its scene", () => {
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

    const sceneConnections = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        fromPosition: { x: 1, y: 0, z: 0 },
        toPosition: { x: 0, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeSceneConnection[];

    const renderer = new LatticeSceneRenderer(scenePoints, sceneConnections);

    const connectionLines = renderer.scene.children.filter(
      (child): child is THREE.Line => child instanceof THREE.Line,
    );

    expect(renderer.pointMeshes).toHaveLength(2);
    expect(connectionLines).toHaveLength(1);

    expect(renderer.connectionLines[0]?.userData.fromLatticeScenePointId).toBe(
      "ratio-1",
    );
    expect(renderer.connectionLines[0]?.userData.toLatticeScenePointId).toBe(
      "ratio-2",
    );
  });

  it("replaces point meshes and connection lines together", () => {
    const ratio1 = createTestRatio(3n, 2n);
    const ratio2 = createTestRatio(5n, 4n);

    const initialScenePoints = [
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

    const initialSceneConnections = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        fromPosition: { x: 1, y: 0, z: 0 },
        toPosition: { x: 0, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeSceneConnection[];

    const ratio3 = createTestRatio(7n, 4n);
    const ratio4 = createTestRatio(9n, 8n);

    const nextScenePoints = [
      {
        id: "ratio-3",
        rawInput: "7/4",
        ratio: ratio3,
        labelRatio: ratio3,
        position: { x: 0, y: 0, z: 1 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
      {
        id: "ratio-4",
        rawInput: "9/8",
        ratio: ratio4,
        labelRatio: ratio4,
        position: { x: 2, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const nextSceneConnections = [
      {
        fromId: "ratio-3",
        toId: "ratio-4",
        fromPosition: { x: 0, y: 0, z: 1 },
        toPosition: { x: 2, y: 0, z: 0 },
      },
    ] satisfies readonly LatticeSceneConnection[];

    const renderer = new LatticeSceneRenderer(
      initialScenePoints,
      initialSceneConnections,
    );

    const oldPointMesh = renderer.pointMeshes[0];
    const oldConnectionLine = renderer.connectionLines[0];

    if (!oldPointMesh) throw new Error("Expected initial point mesh");
    if (!oldConnectionLine) throw new Error("Expected initial connection line");

    const pointGeometryDispose = vi.spyOn(oldPointMesh.geometry, "dispose");
    const connectionGeometryDispose = vi.spyOn(
      oldConnectionLine.geometry,
      "dispose",
    );

    renderer.setScene(nextScenePoints, nextSceneConnections);

    expect(pointGeometryDispose).toHaveBeenCalledOnce();
    expect(connectionGeometryDispose).toHaveBeenCalledOnce();

    expect(renderer.pointMeshes).toHaveLength(2);
    expect(renderer.connectionLines).toHaveLength(1);

    expect(renderer.pointMeshes[0]?.userData.latticeScenePointId).toBe(
      "ratio-3",
    );
    expect(renderer.pointMeshes[1]?.userData.latticeScenePointId).toBe(
      "ratio-4",
    );

    expect(renderer.connectionLines[0]?.userData.fromLatticeScenePointId).toBe(
      "ratio-3",
    );
    expect(renderer.connectionLines[0]?.userData.toLatticeScenePointId).toBe(
      "ratio-4",
    );

    expect(renderer.scene.children).not.toContain(oldPointMesh);
    expect(renderer.scene.children).not.toContain(oldConnectionLine);
  });

  it("disposes its point label sprite resources", () => {
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

    const labelTexture = new THREE.Texture();
    const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
    const labelSprite = new THREE.Sprite(labelMaterial);

    vi.mocked(createLatticePointLabelSprite).mockReturnValueOnce(labelSprite);

    const renderer = new LatticeSceneRenderer(scenePoints);

    const textureDispose = vi.spyOn(labelTexture, "dispose");
    const materialDispose = vi.spyOn(labelMaterial, "dispose");

    renderer.dispose();

    expect(textureDispose).toHaveBeenCalledOnce();
    expect(materialDispose).toHaveBeenCalledOnce();
  });

  it("uses a supplied higher-prime colour when creating point meshes", () => {
    const ratio = createTestRatio(11n, 8n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "11/8",
        ratio,
        labelRatio: ratio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: true,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const renderer = new LatticeSceneRenderer(scenePoints, [], {
      higherPrimeColor: "purple",
    });

    const mesh = renderer.pointMeshes[0];

    if (!mesh) throw new Error("Expected a point mesh");

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("purple"));
  });

  it("preserves the supplied higher-prime colour when replacing the scene", () => {
    const initialRatio = createTestRatio(3n, 2n);
    const higherPrimeRatio = createTestRatio(11n, 8n);

    const initialScenePoints = [
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: initialRatio,
        labelRatio: initialRatio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const nextScenePoints = [
      {
        id: "ratio-2",
        rawInput: "11/8",
        ratio: higherPrimeRatio,
        labelRatio: higherPrimeRatio,
        position: { x: 0, y: 1, z: 0 },
        hasHigherPrimeFactors: true,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const renderer = new LatticeSceneRenderer(initialScenePoints, [], {
      higherPrimeColor: "purple",
    });

    renderer.setScene(nextScenePoints, []);

    const mesh = renderer.pointMeshes[0];

    if (!mesh) throw new Error("Expected a point mesh");

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("purple"));
  });

  it("updates the colour of existing higher-prime point meshes", () => {
    const ratio = createTestRatio(11n, 8n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "11/8",
        ratio,
        labelRatio: ratio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: true,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const renderer = new LatticeSceneRenderer(scenePoints);

    renderer.setHigherPrimeColor("purple");

    const mesh = renderer.pointMeshes[0];

    if (!mesh) throw new Error("Expected a point mesh");

    const material = mesh.material;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("purple"));
  });

  it("does not change ordinary point colours", () => {
    const ratio = createTestRatio(11n, 8n);

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

    const renderer = new LatticeSceneRenderer(scenePoints);

    renderer.setHigherPrimeColor("purple");

    const mesh = renderer.pointMeshes[0];
    if (!mesh) throw new Error("Expected a point mesh");

    const material = mesh.material;
    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("red"));
  });

  it("preserves the updated higher-prime colour when replacing the scene", () => {
    const initialRatio = createTestRatio(11n, 8n);

    const scenePoints = [
      {
        id: "ratio-1",
        rawInput: "11/8",
        ratio: initialRatio,
        labelRatio: initialRatio,
        position: { x: 0, y: 0, z: 0 },
        hasHigherPrimeFactors: true,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const nextRatio = createTestRatio(13n, 8n);

    const nextScenePoints = [
      {
        id: "ratio-2",
        rawInput: "13/8",
        ratio: nextRatio,
        labelRatio: nextRatio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: true,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    const renderer = new LatticeSceneRenderer(scenePoints);

    renderer.setHigherPrimeColor("purple");
    renderer.setScene(nextScenePoints, []);

    const mesh = renderer.pointMeshes[0];
    if (!mesh) throw new Error("Expected a point mesh");

    const material = mesh.material;
    if (!(material instanceof THREE.MeshStandardMaterial)) {
      throw new Error("Expected a MeshStandardMaterial");
    }

    expect(material.color).toEqual(new THREE.Color("purple"));
  });

  it("adds lighting to the lattice scene", () => {
    const renderer = new LatticeSceneRenderer([]);
    const lights = renderer.scene.children.filter(
      (child) => child instanceof THREE.Light,
    );

    expect(lights.length).toBeGreaterThan(0);
  });
});
