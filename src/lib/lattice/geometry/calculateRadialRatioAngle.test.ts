import { describe, expect, it } from "vitest";
import { calculateRadialRatioAngle } from "./calculateRadialRatioAngle";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("calculateRadialRatioAngle", () => {
  it("places unison at zero degrees", () => {
    expect(calculateRadialRatioAngle(createTestRatio(1n, 1n))).toBeCloseTo(0);
  });

  it("calculates the angle from the canonical ratio", () => {
    expect(calculateRadialRatioAngle(createTestRatio(3n, 2n))).toBeCloseTo(
      (Math.log(3 / 2) / Math.log(2)) * 360,
    );
  });

  it("places octave-equivalent normalized ratios at the same angle", () => {
    expect(calculateRadialRatioAngle(createTestRatio(3n, 2n))).toBeCloseTo(
      calculateRadialRatioAngle(createTestRatio(3n, 2n)),
    );
  });
});
