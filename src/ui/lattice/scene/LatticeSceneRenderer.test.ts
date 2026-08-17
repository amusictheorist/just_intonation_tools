import { describe, expect, it, vi } from "vitest";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { LatticeSceneRenderer } from "./LatticeSceneRenderer";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";

describe("LatticeSceneRenderer", () => {
  it("adds scene-point meshes to its scene", () => {
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

    const renderer = new LatticeSceneRenderer(scenePoints);

    expect(renderer.scene.children).toHaveLength(2);
    expect(renderer.scene.children[0]?.userData.latticeScenePointId).toBe(
      "ratio-1",
    );
    expect(renderer.scene.children[1]?.userData.latticeScenePointId).toBe(
      "ratio-2",
    );
  });

  it("stores the point meshes it creates", () => {
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

    const renderer = new LatticeSceneRenderer(scenePoints);

    expect(renderer.pointMeshes).toHaveLength(2);
    expect(renderer.pointMeshes[0]).toBe(renderer.scene.children[0]);
    expect(renderer.pointMeshes[1]).toBe(renderer.scene.children[1]);
  });

  it("disposes its point mesh resources", () => {
    const scenePoints = [
      {
        id: "ratio-1",
        position: { x: 1, y: 0, z: 0 },
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
    expect(renderer.scene.children).toHaveLength(0);
  });

  it("replaces its point meshes when scene points change", () => {
    const initialScenePoints = [
      {
        id: "ratio-1",
        position: { x: 1, y: 0, z: 0 },
      },
    ] satisfies readonly LatticeScenePoint[];

    const nextScenePoints = [
      {
        id: "ratio-2",
        position: { x: 0, y: 1, z: 0 },
      },
      {
        id: "ratio-3",
        position: { x: 0, y: 0, z: 1 },
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

    expect(renderer.scene.children).toHaveLength(2);
    expect(renderer.scene.children).not.toContain(oldMesh);
  });

  it("adds connection lines to its scene", () => {
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

    const sceneConnections = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        fromPosition: { x: 1, y: 0, z: 0 },
        toPosition: { x: 0, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeSceneConnection[];

    const renderer = new LatticeSceneRenderer(scenePoints, sceneConnections);

    expect(renderer.pointMeshes).toHaveLength(2);
    expect(renderer.connectionLines).toHaveLength(1);

    expect(renderer.scene.children).toHaveLength(3);

    expect(renderer.connectionLines[0]?.userData.fromLatticeScenePointId).toBe(
      "ratio-1",
    );
    expect(renderer.connectionLines[0]?.userData.toLatticeScenePointId).toBe(
      "ratio-2",
    );
  });

  it("replaces point meshes and connection lines together", () => {
    const initialScenePoints = [
      {
        id: "ratio-1",
        position: { x: 1, y: 0, z: 0 },
      },
      {
        id: "ratio-2",
        position: { x: 0, y: 1, z: 0 },
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

    const nextScenePoints = [
      {
        id: "ratio-3",
        position: { x: 0, y: 0, z: 1 },
      },
      {
        id: "ratio-4",
        position: { x: 2, y: 0, z: 0 },
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
    expect(renderer.scene.children).toHaveLength(3);
  });
});
