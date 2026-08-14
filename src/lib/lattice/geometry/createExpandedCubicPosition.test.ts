import { describe, expect, it } from "vitest";
import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";
import { createExpandedCubicPosition } from "./createExpandedCubicPosition";

const initialPosition = { x: 0, y: 0, z: 0 };

describe("createExpandedCubicPosition", () => {
  it("uses 3-5-7 coordinates directly when there is no higher-prime anchor path", () => {
    const address: ExpandedCubicAddress = {
      anchorPath: [],
      coordinates357: { x: 1, y: -2, z: 3 },
    };

    expect(createExpandedCubicPosition(address, initialPosition)).toEqual({
      x: 1,
      y: -2,
      z: 3,
    });
  });

  it("translates local 3-5-7 coordinates by the higher-prime anchor position", () => {
    const address: ExpandedCubicAddress = {
      anchorPath: [{ prime: 11n, direction: 1 }],
      coordinates357: { x: 1, y: -2, z: 3 },
    };

    function resolveAnchorVector() {
      return { x: 10, y: 20, z: 30 };
    }

    expect(
      createExpandedCubicPosition(
        address,
        initialPosition,
        resolveAnchorVector,
      ),
    ).toEqual({
      x: 11,
      y: 18,
      z: 33,
    });
  });

  it("preserves the global 3-5-7 axis orientation at higher-prime anchors", () => {
    const address: ExpandedCubicAddress = {
      anchorPath: [
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
      ],
      coordinates357: { x: 1, y: -2, z: 3 },
    };

    function resolveAnchorVector(step: { prime: bigint; direction: 1 | -1 }) {
      if (step.prime === 11n) return { x: 3, y: 4, z: 5 };
      return { x: -1, y: 2, z: 1 };
    }

    expect(
      createExpandedCubicPosition(
        address,
        initialPosition,
        resolveAnchorVector,
      ),
    ).toEqual({
      x: 3,
      y: 4,
      z: 9,
    });
  });
});
