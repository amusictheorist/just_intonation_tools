// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import type { PositionedLatticeRatio } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import { renderHook } from "@testing-library/react";
import { useLatticeSceneData } from "./useLatticeSceneData";

const positionedRatios: readonly PositionedLatticeRatio[] = [
  {
    latticeRatio: {
      id: "ratio-1",
      rawInput: "3/2",
      ratio: createTestRatio(3n, 2n),
    },
    placement: {
      type: "cubic",
      variant: {
        type: "standard",
        coordinates: { x: 1, y: 0, z: 0 },
      },
    },
    position: { x: 1, y: 0, z: 0 },
  },
];

const showAllConnections = {
  showConnections: true,
  visiblePrimes: null,
} as const;

describe("useLatticeSceneData", () => {
  it("derives render-ready scene data from positioned lattice ratios", () => {
    const { result } = renderHook(() =>
      useLatticeSceneData(positionedRatios, showAllConnections),
    );

    expect(result.current.scenePoints).toEqual([
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: createTestRatio(3n, 2n),
        labelRatio: createTestRatio(3n, 2n),
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ]);

    expect(result.current.sceneConnections).toEqual([]);
  });

  it("creates radial scene connections", () => {
    const radialRatios: readonly PositionedLatticeRatio[] = [
      {
        latticeRatio: {
          id: "unison",
          rawInput: "1/1",
          ratio: createTestRatio(1n, 1n),
        },
        placement: {
          type: "radial",
          variant: {
            type: "standard",
            address: {
              normalizedRatio: createTestRatio(1n, 1n),
              path: [],
              distance: 0,
            },
          },
        },
        position: { x: 0, y: 0, z: 0 },
      },
      {
        latticeRatio: {
          id: "three",
          rawInput: "3/2",
          ratio: createTestRatio(3n, 2n),
        },
        placement: {
          type: "radial",
          variant: {
            type: "standard",
            address: {
              normalizedRatio: createTestRatio(3n, 2n),
              path: [{ prime: 3n, direction: 1 }],
              distance: 1,
            },
          },
        },
        position: { x: 1, y: 0, z: 0 },
      },
    ];

    const { result } = renderHook(() =>
      useLatticeSceneData(radialRatios, showAllConnections),
    );

    expect(result.current.sceneConnections).toEqual([
      {
        fromId: "unison",
        toId: "three",
        fromPosition: { x: 0, y: 0, z: 0 },
        toPosition: { x: 1, y: 0, z: 0 },
      },
    ]);
  });

  it("hides all scene connections when connections are disabled", () => {
    const connectedRatios: readonly PositionedLatticeRatio[] = [
      {
        latticeRatio: {
          id: "a",
          rawInput: "1",
          ratio: createTestRatio(1n, 1n),
        },
        placement: {
          type: "cubic",
          variant: {
            type: "standard",
            coordinates: { x: 0, y: 0, z: 0 },
          },
        },
        position: { x: 0, y: 0, z: 0 },
      },
      {
        latticeRatio: {
          id: "b",
          rawInput: "3/2",
          ratio: createTestRatio(3n, 2n),
        },
        placement: {
          type: "cubic",
          variant: {
            type: "standard",
            coordinates: { x: 1, y: 0, z: 0 },
          },
        },
        position: { x: 1, y: 0, z: 0 },
      },
    ];

    const { result } = renderHook(() =>
      useLatticeSceneData(connectedRatios, {
        showConnections: false,
        visiblePrimes: null,
      }),
    );

    expect(result.current.sceneConnections).toEqual([]);
  });

  it("filters scene connections by visible prime axis", () => {
    const connectedRatios: readonly PositionedLatticeRatio[] = [
      {
        latticeRatio: {
          id: "origin",
          rawInput: "1",
          ratio: createTestRatio(1n, 1n),
        },
        placement: {
          type: "cubic",
          variant: {
            type: "standard",
            coordinates: { x: 0, y: 0, z: 0 },
          },
        },
        position: { x: 0, y: 0, z: 0 },
      },
      {
        latticeRatio: {
          id: "three",
          rawInput: "3/2",
          ratio: createTestRatio(3n, 2n),
        },
        placement: {
          type: "cubic",
          variant: {
            type: "standard",
            coordinates: { x: 1, y: 0, z: 0 },
          },
        },
        position: { x: 1, y: 0, z: 0 },
      },
      {
        latticeRatio: {
          id: "five",
          rawInput: "5/4",
          ratio: createTestRatio(5n, 4n),
        },
        placement: {
          type: "cubic",
          variant: {
            type: "standard",
            coordinates: { x: 0, y: 1, z: 0 },
          },
        },
        position: { x: 0, y: 1, z: 0 },
      },
    ];

    const { result } = renderHook(() =>
      useLatticeSceneData(connectedRatios, {
        showConnections: true,
        visiblePrimes: new Set([3n]),
      }),
    );

    expect(result.current.sceneConnections).toEqual([
      {
        fromId: "origin",
        toId: "three",
        fromPosition: { x: 0, y: 0, z: 0 },
        toPosition: { x: 1, y: 0, z: 0 },
      },
    ]);
  });
});
