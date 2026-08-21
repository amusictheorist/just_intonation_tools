import { describe, expect, it } from "vitest";
import type { LatticeConnection } from "../connections/latticeConnection";
import type { LatticeScenePoint } from "./latticeScenePoint";
import { createLatticeSceneConnections } from "./createLatticeSceneConnections";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createLatticeSceneConnections", () => {
  it("creates scene connections from lattice connections and scene points", () => {
    const connection = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        prime: 3n,
      },
      {
        fromId: "ratio-2",
        toId: "ratio-3",
        prime: 5n,
      },
    ] satisfies readonly LatticeConnection[];

    const ratio1 = createTestRatio(3n, 2n);
    const ratio2 = createTestRatio(5n, 4n);
    const ratio3 = createTestRatio(7n, 4n);

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
      {
        id: "ratio-3",
        rawInput: "7/4",
        ratio: ratio3,
        labelRatio: ratio3,
        position: { x: 0, y: 0, z: 1 },
        hasHigherPrimeFactors: false,
        radialSide: null,
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
