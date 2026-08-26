import { describe, expect, it } from "vitest";
import { isExpandedCubicLocalConnectionVisible } from "./isExpandedCubicLocalConnectionVisible";

describe("isExpandedCubicLocalConnectionVisible", () => {
  it("connects unobstructed local cubic points at the same higher-prime anchor", () => {
    expect(
      isExpandedCubicLocalConnectionVisible(
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 2, y: 0, z: 0 },
        },
        [],
      ),
    ).toBe(true);
  });

  it("does not connect local cubic points when another point at the same anchor lies between them", () => {
    expect(
      isExpandedCubicLocalConnectionVisible(
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 2, y: 0, z: 0 },
        },

        [
          {
            anchorPath: [{ prime: 11n, direction: 1 }],
            coordinates357: { x: 1, y: 0, z: 0 },
          },
        ],
      ),
    ).toBe(false);
  });

  it("ignores potential blockers at a different higher-prime anchor", () => {
    expect(
      isExpandedCubicLocalConnectionVisible(
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 2, y: 0, z: 0 },
        },

        [
          {
            anchorPath: [{ prime: 13n, direction: 1 }],
            coordinates357: { x: 1, y: 0, z: 0 },
          },
        ],
      ),
    ).toBe(true);
  });
});
