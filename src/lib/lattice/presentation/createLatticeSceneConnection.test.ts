import { describe, expect, it } from "vitest";
import type { LatticeConnection } from "../connections/latticeConnection";
import type { LatticeScenePoint } from "./latticeScenePoint";
import { createLatticeSceneConnection } from "./createLatticeSceneConnection";

describe("createLatticeSceneConnection", () => {
  it("creates a scene connection from connected scene points", () => {
    const connection = {
      fromId: "ratio-1",
      toId: "ratio-2",
    } satisfies LatticeConnection;

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

    expect(createLatticeSceneConnection(connection, scenePoints)).toEqual({
      fromId: "ratio-1",
      toId: "ratio-2",
      fromPosition: { x: 1, y: 2, z: 3 },
      toPosition: { x: 4, y: 5, z: 6 },
    });
  });

  it("throws when the connection source point is missing", () => {
    const connection = {
      fromId: "ratio-1",
      toId: "ratio-2",
    } satisfies LatticeConnection;

    const scenePoints = [
      {
        id: "ratio-2",
        position: { x: 4, y: 5, z: 6 },
      },
    ] satisfies readonly LatticeScenePoint[];

    expect(() => createLatticeSceneConnection(connection, scenePoints)).toThrow(
      "Missing scene point for connection source: ratio-1",
    );
  });

  it("throws when the connection target point is missing", () => {
    const connection = {
      fromId: "ratio-1",
      toId: "ratio-2",
    } satisfies LatticeConnection;

    const scenePoints = [
      {
        id: "ratio-1",
        position: { x: 1, y: 2, z: 3 },
      },
    ] satisfies readonly LatticeScenePoint[];

    expect(() => createLatticeSceneConnection(connection, scenePoints)).toThrow(
      "Missing scene point for connection target: ratio-2",
    );
  });
});
