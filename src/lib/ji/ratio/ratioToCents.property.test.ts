import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { ratioArbitrary } from "../test/ratioArbitraries";
import { invertRatio } from "./invertRatio";
import { ratioToCents } from "./ratioToCents";
import { multiplyRatios } from "./multiplyRatios";

describe("ratioToCents properties", () => {
  it("maps inverse ratios to opposite cent values", () => {
    fc.assert(
      fc.property(ratioArbitrary, (ratio) => {
        const inverted = invertRatio(ratio);

        expect(ratioToCents(inverted)).toBeCloseTo(-ratioToCents(ratio), 10);
      }),
    );
  });

  it("is additive under ratio multiplication", () => {
    fc.assert(
      fc.property(ratioArbitrary, ratioArbitrary, (left, right) => {
        const product = multiplyRatios(left, right);

        expect(ratioToCents(product)).toBeCloseTo(
          ratioToCents(left) + ratioToCents(right),
          9,
        );
      }),
    );
  });
});
