import { describe, expect, it } from "vitest";
import { isExpandedCubicHigherPrimeConnectionVisible } from "./isExpandedCubicHigherPrimeConnectionVisible";

describe("isExpandedCubicHigherPrimeConnectionVisible", () => {
  it("connects higher-prime-axis points when no point lies between them", () => {
    expect(
      isExpandedCubicHigherPrimeConnectionVisible(
        {
          anchorPath: [{ prime: 11n, direction: -1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        [],
      ),
    ).toBe(true);
  });

  it("does not connect higher-prime-axis points when another point lies between them", () => {
    expect(
      isExpandedCubicHigherPrimeConnectionVisible(
        {
          anchorPath: [{ prime: 11n, direction: -1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        [
          {
            anchorPath: [],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        ],
      ),
    ).toBe(false);
  });

  it("ignores points on a different higher-prime axis", () => {
    expect(
      isExpandedCubicHigherPrimeConnectionVisible(
        {
          anchorPath: [{ prime: 11n, direction: -1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        [
          {
            anchorPath: [{ prime: 13n, direction: 1 }],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        ],
      ),
    ).toBe(true);
  });

  it("ignores potential blockers with different local 3-5-7 coordinates", () => {
    expect(
      isExpandedCubicHigherPrimeConnectionVisible(
        {
          anchorPath: [{ prime: 11n, direction: -1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        [
          {
            anchorPath: [],
            coordinates357: { x: 1, y: 0, z: 0 },
          },
        ],
      ),
    ).toBe(true);
  });
});
