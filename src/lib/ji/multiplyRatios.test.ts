import { describe, expect, it } from "vitest";
import { multiplyRatios } from "./multiplyRatios";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";

describe("multiplyRatios", () => {
  it("multiplies two ratios", () => {
    const left = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );
    const right = createRatio(
      createPositiveInteger(5n),
      createPositiveInteger(4n),
    );

    expect(multiplyRatios(left, right)).toEqual({
      numerator: 15n,
      denominator: 8n,
    });
  });

  it("reduced the product to canonical form", () => {
    const left = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );
    const right = createRatio(
      createPositiveInteger(4n),
      createPositiveInteger(9n),
    );

    expect(multiplyRatios(left, right)).toEqual({
      numerator: 2n,
      denominator: 3n,
    });
  });

  it("preserves a ratio when multiplied by unison", () => {
    const ratio = createRatio(
      createPositiveInteger(7n),
      createPositiveInteger(5n),
    );
    const unison = createRatio(
      createPositiveInteger(1n),
      createPositiveInteger(1n),
    );

    expect(multiplyRatios(ratio, unison)).toEqual(ratio);
  });

  it("returns the same product when the inputs are reversed", () => {
    const left = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );
    const right = createRatio(
      createPositiveInteger(2n),
      createPositiveInteger(3n),
    );

    expect(multiplyRatios(left, right)).toEqual(multiplyRatios(right, left));
  });

  it("multiplies values beyond JavaScript's safe-integer range exactly", () => {
    const left = createRatio(
      createPositiveInteger(9_007_199_254_740_993n),
      createPositiveInteger(2n),
    );
    const right = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(5n),
    );

    expect(multiplyRatios(left, right)).toEqual({
      numerator: 27_021_597_764_222_979n,
      denominator: 10n,
    });
  });
});
