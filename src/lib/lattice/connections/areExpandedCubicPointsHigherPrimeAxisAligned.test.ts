import { describe, expect, it } from "vitest";
import { areExpandedCubicPointsHigherPrimeAxisAligned } from "./areExpandedCubicPointsHigherPrimeAxisAligned";

describe("areExpandedCubicPointsHigherPrimeAxisAligned", () => {
  it("identifies points separated along one higher-prime axis", () => {
    expect(
      areExpandedCubicPointsHigherPrimeAxisAligned(
        {
          anchorPath: [],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [
            { prime: 11n, direction: 1 },
            { prime: 11n, direction: 1 },
          ],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
      ),
    ).toBe(true);
  });

  it("identifies opposite directions on the same higher-prime axis", () => {
    expect(
      areExpandedCubicPointsHigherPrimeAxisAligned(
        {
          anchorPath: [{ prime: 11n, direction: -1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
      ),
    ).toBe(true);
  });

  it("rejects points separated along more than one higher-prime axis", () => {
    expect(
      areExpandedCubicPointsHigherPrimeAxisAligned(
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 13n, direction: 1 }],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
      ),
    ).toBe(false);
  });

  it("rejects points with different local 3-5-7 coordinates", () => {
    expect(
      areExpandedCubicPointsHigherPrimeAxisAligned(
        {
          anchorPath: [],
          coordinates357: { x: 0, y: 0, z: 0 },
        },
        {
          anchorPath: [{ prime: 11n, direction: 1 }],
          coordinates357: { x: 1, y: 0, z: 0 },
        },
      ),
    ).toBe(false);
  });
});
