import { describe, expect, it } from "vitest";
import { areExpandedCubicPointsOnSameAnchor } from "./areExpandedCubicPointsOnSameAnchor";

describe("areExpandedCubicPointsOnSameAnchor", () => {
  it("identifies expanded-cubic points with the same higher-prime anchor path", () => {
    expect(
      areExpandedCubicPointsOnSameAnchor(
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 1, y: 0, z: 0 },
        },
      ),
    ).toBe(true);
  });

  it("rejects expanded-cubic points with different higher-prime anchor paths", () => {
    expect(
      areExpandedCubicPointsOnSameAnchor(
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 13n, direction: 1 }],
          coordinates357: { x: 1, y: 0, z: 0 },
        },
      ),
    ).toBe(false);
  });
});
