import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";
import { greatestCommonDivisor } from "./greatestCommonDivisor";
import { areRatiosEqual } from "./areRatiosEqual";

describe("createRatio properties", () => {
  it("return comprime canonical terms", () => {
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
});
