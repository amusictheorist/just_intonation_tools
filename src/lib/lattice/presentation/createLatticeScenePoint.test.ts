import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import type { PositionedLatticeRatio } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import { createLatticeScenePoint } from "./createLatticeScenePoint";

describe("createLatticeScenePoint", () => {
  it("creates a scene point from an already-positioned lattice ratio", () => {
    const positionedRatio = {
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
    } satisfies PositionedLatticeRatio;

    expect(createLatticeScenePoint(positionedRatio)).toEqual({
      id: "ratio-1",
      position: { x: 12, y: -7, z: 31 },
    });
  });
});
