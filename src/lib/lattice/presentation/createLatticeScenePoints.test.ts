import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import type { PositionedLatticeRatio } from "../state/createPositionedLatticeRatios";
import { createLatticeScenePoints } from "./createLatticeScenePoints";

describe("createLatticeScenePoints", () => {
  it("creates scene points for positioned lattice ratios", () => {
    const positionedRatios = [
      {
        latticeRatio: {
          id: "ratio-1",
          rawInput: "3/2",
          ratio: createTestRatio(3n, 2n),
        },
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: { x: 1, y: 0, z: 0 },
          },
        },
        position: { x: 12, y: -7, z: 31 },
      },
      {
        latticeRatio: {
          id: "ratio-2",
          rawInput: "5/4",
          ratio: createTestRatio(5n, 4n),
        },
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: { x: 0, y: 1, z: 0 },
          },
        },
        position: { x: -4, y: 9, z: 2 },
      },
    ] satisfies readonly PositionedLatticeRatio[];

    expect(createLatticeScenePoints(positionedRatios)).toEqual([
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: createTestRatio(3n, 2n),
        labelRatio: createTestRatio(3n, 2n),
        position: { x: 12, y: -7, z: 31 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
      {
        id: "ratio-2",
        rawInput: "5/4",
        ratio: createTestRatio(5n, 4n),
        labelRatio: createTestRatio(5n, 4n),
        position: { x: -4, y: 9, z: 2 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ]);
  });
});
