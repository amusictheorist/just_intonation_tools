import { describe, expect, it } from "vitest";
import { calculateRadialPrimeAngle } from "./calculateRadialPrimeAngle";

describe("calculateRadialPrimeAngle", () => {
  it("calculates the radial angle of a positive prime step", () => {
    expect(
      calculateRadialPrimeAngle({
        prime: 3n,
        direction: 1,
      }),
    ).toBeCloseTo(Math.log2(3 / 2) * 360);
  });

  it("octave-normalizes a positive prime step before calculating its angle", () => {
    expect(
      calculateRadialPrimeAngle({
        prime: 5n,
        direction: 1,
      }),
    ).toBeCloseTo(Math.log2(5 / 4) * 360);
  });

  it("calculates the radial angle of a negative prime step", () => {
    expect(
      calculateRadialPrimeAngle({
        prime: 3n,
        direction: -1,
      }),
    ).toBeCloseTo(Math.log2(4 / 3) * 360);
  });

  it("octave-normalizes a negative prime step before calculating its angle", () => {
    expect(
      calculateRadialPrimeAngle({
        prime: 5n,
        direction: -1,
      }),
    ).toBeCloseTo(Math.log2(8 / 5) * 360);
  });

  it("places positie and negative directions at complementary angles", () => {
    const positiveAngle = calculateRadialPrimeAngle({
      prime: 7n,
      direction: 1,
    });
    const negativeAngle = calculateRadialPrimeAngle({
      prime: 7n,
      direction: -1,
    });

    expect(positiveAngle + negativeAngle).toBeCloseTo(360);
  });
});
