import { describe, expect, it } from "vitest";
import { createUnisonRatio } from "./createUnisonRatio";
import { ratioToCents } from "./ratioToCents";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "../integer/positiveInteger";

describe("ratioToCents", () => {
  it("returns zero cents for unison", () => {
    const ratio = createUnisonRatio();

    expect(ratioToCents(ratio)).toBe(0);
  });

  it("returns 1200 cents for an octave", () => {
    const ratio = createRatio(
      createPositiveInteger(2n),
      createPositiveInteger(1n),
    );

    expect(ratioToCents(ratio)).toBeCloseTo(1200);
  });

  it("converts 3/2 to approximately 701.955 cents", () => {
    const ratio = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );

    expect(ratioToCents(ratio)).toBeCloseTo(701.955, 3);
  });

  it("returns negative cents for a ratio below unison", () => {
    const ratio = createRatio(
      createPositiveInteger(1n),
      createPositiveInteger(2n),
    );

    expect(ratioToCents(ratio)).toBeCloseTo(-1200);
  });

  it("supports canonical ratios with very large terms", () => {
    const numerator = 2n ** 2000n + 1n;
    const denominator = 2n ** 1999n + 1n;

    const ratio = createRatio(
      createPositiveInteger(numerator),
      createPositiveInteger(denominator),
    );

    expect(Number.isFinite(ratioToCents(ratio))).toBe(true);
  });
});
