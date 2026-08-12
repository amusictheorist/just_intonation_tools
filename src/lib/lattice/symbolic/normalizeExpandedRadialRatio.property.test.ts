import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  factorableRatioArbitrary,
  ratioArbitrary,
} from "../../ji/test/ratioArbitraries";
import { normalizeExpandedRadialRatio } from "./normalizeExpandedRadialRatio";
import { factorPrimesIgnoringTwo } from "./factorPrimesIgnoringTwo";

describe("normalizeExpandedRadialRatio properties", () => {
  it("normalizes ratios at or above unison into [1, 2)", () => {
    fc.assert(
      fc.property(ratioArbitrary, (ratio) => {
        fc.pre(ratio.numerator >= ratio.denominator);

        const normalized = normalizeExpandedRadialRatio(ratio);

        expect(normalized.numerator >= normalized.denominator).toBe(true);
        expect(normalized.numerator < normalized.denominator * 2n).toBe(true);
      }),
    );
  });

  it("normalizes ratios below unison into [1/2, 1)", () => {
    fc.assert(
      fc.property(ratioArbitrary, (ratio) => {
        fc.pre(ratio.numerator < ratio.denominator);

        const normalized = normalizeExpandedRadialRatio(ratio);

        expect(normalized.numerator < normalized.denominator).toBe(true);
        expect(normalized.numerator * 2n >= normalized.denominator).toBe(true);
      }),
    );
  });

  it("preserves all prime exponents other than 2", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const normalized = normalizeExpandedRadialRatio(ratio);

        expect(factorPrimesIgnoringTwo(normalized)).toEqual(
          factorPrimesIgnoringTwo(ratio),
        );
      }),
    );
  });
});
