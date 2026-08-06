import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";
import { greatestCommonDivisor } from "./greatestCommonDivisor";
import { areRatiosEqual } from "./areRatiosEqual";
import { multiplyRatios } from "./multiplyRatios";

describe("createRatio properties", () => {
  it("returns coprime canonical terms", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (numerator, denominator) => {
          const ratio = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          expect(
            greatestCommonDivisor(ratio.numerator, ratio.denominator),
          ).toBe(1n);
        },
      ),
    );
  });

  it("preserves the original rational value", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (numerator, denominator) => {
          const ratio = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          expect(ratio.numerator * denominator).toBe(
            numerator * ratio.denominator,
          );
        },
      ),
    );
  });

  it("is invariant under common positive scaling", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (numerator, denominator, factor) => {
          const original = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          const scaled = createRatio(
            createPositiveInteger(numerator * factor),
            createPositiveInteger(denominator * factor),
          );

          expect(scaled).toEqual(original);
        },
      ),
    );
  });

  it("is idempotent", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (numerator, denominator) => {
          const ratio = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          expect(createRatio(ratio.numerator, ratio.denominator)).toEqual(
            ratio,
          );
        },
      ),
    );
  });

  it("treats commonly scaled ratios as equal", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (numerator, denominator, factor) => {
          const original = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          const scaled = createRatio(
            createPositiveInteger(numerator * factor),
            createPositiveInteger(denominator * factor),
          );

          expect(areRatiosEqual(original, scaled)).toBe(true);
        },
      ),
    );
  });

  it("preserves every ratio when multiplied by unison", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (numerator, denominator) => {
          const ratio = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );
          const unison = createRatio(
            createPositiveInteger(1n),
            createPositiveInteger(1n),
          );

          expect(multiplyRatios(ratio, unison)).toEqual(ratio);
        },
      ),
    );
  });

  it("is commutative", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (leftNumerator, leftDenominator, rightNumerator, rightDenominator) => {
          const left = createRatio(
            createPositiveInteger(leftNumerator),
            createPositiveInteger(leftDenominator),
          );
          const right = createRatio(
            createPositiveInteger(rightNumerator),
            createPositiveInteger(rightDenominator),
          );

          expect(multiplyRatios(left, right)).toEqual(
            multiplyRatios(right, left),
          );
        },
      ),
    );
  });
});
