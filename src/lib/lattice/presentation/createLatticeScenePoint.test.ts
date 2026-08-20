import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import type { PositionedLatticeRatio } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import { createLatticeScenePoint } from "./createLatticeScenePoint";
import { normalizeRadialRatio } from "../symbolic/normalizeRadialRatio";

describe("createLatticeScenePoint", () => {
  it("creates a scene point from a standard cubic positioned ratio", () => {
    const ratio = createTestRatio(3n, 1n);

    const positionedRatio = {
      latticeRatio: {
        id: "ratio-1",
        rawInput: "3/1",
        ratio,
      },
      placement: {
        type: "cubic",
        placement: {
          type: "standard",
          coordinates: { x: 1, y: 0, z: 0 },
        },
      },
      position: { x: 12, y: -7, z: 31 },
    } satisfies PositionedLatticeRatio;

    expect(createLatticeScenePoint(positionedRatio)).toEqual({
      id: "ratio-1",
      rawInput: "3/1",
      ratio,
      labelRatio: createTestRatio(3n, 2n),
      position: { x: 12, y: -7, z: 31 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    });
  });

  it("identifies an expanded cubic point with higher-prime factors", () => {
    const ratio = createTestRatio(11n, 4n);

    const positionedRatio = {
      latticeRatio: {
        id: "ratio-2",
        rawInput: "11/4",
        ratio,
      },
      placement: {
        type: "cubic",
        placement: {
          type: "expanded",
          address: {
            anchorPath: [{ prime: 11n, direction: 1 }],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        },
      },
      position: { x: 4, y: 5, z: 6 },
    } satisfies PositionedLatticeRatio;

    expect(createLatticeScenePoint(positionedRatio)).toEqual({
      id: "ratio-2",
      rawInput: "11/4",
      ratio,
      labelRatio: createTestRatio(11n, 8n),
      position: { x: 4, y: 5, z: 6 },
      hasHigherPrimeFactors: true,
      radialSide: null,
    });
  });

  it("does not assign a radial side to a standard radial point", () => {
    const ratio = createTestRatio(5n, 8n);

    const positionedRatio = {
      latticeRatio: {
        id: "ratio-3",
        rawInput: "5/8",
        ratio,
      },
      placement: {
        type: "radial",
        placement: {
          type: "standard",
          address: {
            normalizedRatio: normalizeRadialRatio(ratio),
            path: [{ prime: 5n, direction: 1 }],
            distance: 1,
          },
        },
      },
      position: { x: 1, y: 0, z: 2 },
    } satisfies PositionedLatticeRatio;

    expect(createLatticeScenePoint(positionedRatio)).toEqual({
      id: "ratio-3",
      rawInput: "5/8",
      ratio,
      labelRatio: createTestRatio(5n, 4n),
      position: { x: 1, y: 0, z: 2 },
      hasHigherPrimeFactors: false,
      radialSide: null,
    });
  });

  it("preserves the normalized ratio, side, and higher-prime status of an expanded radial point", () => {
    const ratio = createTestRatio(8n, 11n);
    const normalizedRatio = createTestRatio(8n, 11n);

    const positionedRatio = {
      latticeRatio: {
        id: "ratio-4",
        rawInput: "2/11",
        ratio,
      },
      placement: {
        type: "radial",
        placement: {
          type: "expanded",
          address: {
            normalizedRatio,
            side: "lower",
            path: [{ prime: 11n, direction: -1 }],
            distance: 1,
          },
        },
      },
      position: { x: -3, y: -1, z: 7 },
    } satisfies PositionedLatticeRatio;

    expect(createLatticeScenePoint(positionedRatio)).toEqual({
      id: "ratio-4",
      rawInput: "2/11",
      ratio,
      labelRatio: normalizedRatio,
      position: { x: -3, y: -1, z: 7 },
      hasHigherPrimeFactors: true,
      radialSide: "lower",
    });
  });
});
