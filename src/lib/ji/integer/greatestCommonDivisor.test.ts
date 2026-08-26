import { describe, expect, it } from "vitest";
import { greatestCommonDivisor } from "./greatestCommonDivisor";
import { createPositiveInteger } from "./positiveInteger";

describe("greatestCommonDivisor", () => {
  it("returns one for two values of one", () => {
    expect(
      greatestCommonDivisor(
        createPositiveInteger(1n),
        createPositiveInteger(1n),
      ),
    ).toBe(1n);
  });

  it("returns the shared value when both inputs are equal", () => {
    expect(
      greatestCommonDivisor(
        createPositiveInteger(6n),
        createPositiveInteger(6n),
      ),
    ).toBe(6n);
  });

  it("returns the greatest shared divisor", () => {
    expect(
      greatestCommonDivisor(
        createPositiveInteger(8n),
        createPositiveInteger(12n),
      ),
    ).toBe(4n);
  });

  it("returns the same result when the inputs are reversed", () => {
    expect(
      greatestCommonDivisor(
        createPositiveInteger(12n),
        createPositiveInteger(8n),
      ),
    ).toBe(4n);
  });

  it("returns one for comprime inputs", () => {
    expect(
      greatestCommonDivisor(
        createPositiveInteger(35n),
        createPositiveInteger(64n),
      ),
    ).toBe(1n);
  });

  it("handles values beyond JavaScript's safe-integer range", () => {
    expect(
      greatestCommonDivisor(
        createPositiveInteger(18_014_398_509_481_984n),
        createPositiveInteger(27_021_597_764_222_976n),
      ),
    ).toBe(9_007_199_254_740_992n);
  });
});
