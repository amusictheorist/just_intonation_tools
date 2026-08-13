import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { calculateRadialPrimeAngle } from "./calculateRadialPrimeAngle";

describe("calculateRadialPrimeAngle properties", () => {
  it("places inverse prime steps at complementary angles", () => {
    fc.assert(
      fc.property(fc.constantFrom(3n, 5n, 7n, 11n, 13n, 17n, 19n), (prime) => {
        const positiveAngle = calculateRadialPrimeAngle({
          prime,
          direction: 1,
        });
        const negativeAngle = calculateRadialPrimeAngle({
          prime,
          direction: -1,
        });

        expect(positiveAngle + negativeAngle).toBeCloseTo(360);
      }),
    );
  });
});
