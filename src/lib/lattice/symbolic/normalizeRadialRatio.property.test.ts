import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  factorableRatioArbitrary,
  ratioArbitrary,
} from "../../ji/test/ratioArbitraries";
import { normalizeRadialRatio } from "./normalizeRadialRatio";
import { factorPrimesIgnoringTwo } from "./factorPrimesIgnoringTwo";

describe("normalizeRadialRatio properties", () => {
  it("normalizes every ratio into [1, 2)", () => {
    fc.assert(
      fc.property(ratioArbitrary, (ratio) => {
        const normalized = normalizeRadialRatio(ratio);

        expect(normalized.numerator >= normalized.denominator).toBe(true);
        expect(normalized.numerator < normalized.denominator * 2n).toBe(true);
      }),
    );
  });

  it("preserves all prime exponents other than 2", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const normalized = normalizeRadialRatio(ratio);

        expect(factorPrimesIgnoringTwo(normalized)).toEqual(
          factorPrimesIgnoringTwo(ratio),
        );
      }),
    );
  });
});
