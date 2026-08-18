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
      placement: {
        type: "standard",
        coordinates: { x: 1, y: 0, z: 0 },
      },
    },
    position: { x: 1, y: 0, z: 0 },
  },
];

describe("useLatticeSceneData", () => {
  it("derives render-ready scene data from positioned lattice ratios", () => {
    const { result } = renderHook(() => useLatticeSceneData(positionedRatios));

    expect(result.current.scenePoints).toEqual([
      {
        id: "ratio-1",
        position: { x: 1, y: 0, z: 0 },
      },
    ]);

    expect(result.current.sceneConnections).toEqual([]);
  });

  it("rejects radial scene connection derivation", () => {
    const radialRatios: readonly PositionedLatticeRatio[] = [
      {
        latticeRatio: {
          id: "ratio-1",
          rawInput: "3/2",
          ratio: createTestRatio(3n, 2n),
        },
        placement: {
          type: "radial",
          placement: {
            type: "standard",
            address: {
              path: [{ prime: 3n, direction: 1 }],
              distance: 0,
            },
          },
        },
        position: { x: 1, y: 0, z: 0 },
      },
    ];

    expect(() => renderHook(() => useLatticeSceneData(radialRatios))).toThrow(
      "Radial lattice connections are not implemented",
    );
  });
});
