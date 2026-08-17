import { describe, expect, it } from "vitest";
import type { LatticeConnection } from "../connections/latticeConnection";
import type { LatticeScenePoint } from "./latticeScenePoint";
import { createLatticeSceneConnections } from "./createLatticeSceneConnections";

describe("createLatticeSceneConnections", () => {
  it("creates scene connections from lattice connections and scene points", () => {
    const connection = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
      },
      {
        fromId: "ratio-2",
        toId: "ratio-3",
      },
    ] satisfies readonly LatticeConnection[];

    const scenePoints = [
      {
        id: "ratio-1",
        position: { x: 1, y: 0, z: 0 },
      },
      {
        id: "ratio-2",
        position: { x: 0, y: 1, z: 0 },
      },
      {
        id: "ratio-3",
        position: { x: 0, y: 0, z: 1 },
      },
    ] satisfies LatticeScenePoint[];

    expect(createLatticeSceneConnections(connection, scenePoints)).toEqual([
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        fromPosition: { x: 1, y: 0, z: 0 },
        toPosition: { x: 0, y: 1, z: 0 },
      },
      {
        fromId: "ratio-2",
        toId: "ratio-3",
        fromPosition: { x: 0, y: 1, z: 0 },
        toPosition: { x: 0, y: 0, z: 1 },
      },
    ]);
  });
});
