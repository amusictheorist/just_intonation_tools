import { describe, expect, it } from "vitest";
import type { LatticeConnection } from "../connections/latticeConnection";
import type { LatticeScenePoint } from "./latticeScenePoint";
import { createLatticeSceneConnection } from "./createLatticeSceneConnection";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createLatticeSceneConnection", () => {
  it("creates a scene connection from connected scene points", () => {
    const connection = {
      fromId: "ratio-1",
      toId: "ratio-2",
    } satisfies LatticeConnection;

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

    const ratio2 = createTestRatio(5n, 4n);

    const scenePoints = [
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

    expect(() => createLatticeSceneConnection(connection, scenePoints)).toThrow(
      "Missing scene point for connection source: ratio-1",
    );
  });

  it("throws when the connection target point is missing", () => {
    const connection = {
      fromId: "ratio-1",
      toId: "ratio-2",
    } satisfies LatticeConnection;

    const ratio1 = createTestRatio(3n, 2n);

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
    ] satisfies readonly LatticeScenePoint[];

    expect(() => createLatticeSceneConnection(connection, scenePoints)).toThrow(
      "Missing scene point for connection target: ratio-2",
    );
  });
});
