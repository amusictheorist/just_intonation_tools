import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createRatio } from "../../ji/ratio";
import { createPositiveInteger } from "../../ji/positiveInteger";
import { factorOddPrimes } from "./factorOddPrimes";

describe("factorOddPrimes properties", () => {
  it("never includes 2 as a factor", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n, max: 1_000_000n }),
        fc.bigInt({ min: 1n, max: 1_000_000n }),
        (numerator, denominator) => {
          const ratio = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          expect(factorOddPrimes(ratio).has(2n)).toBe(false);
        },
      ),
    );
  });

  it("never returns zero exponents", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n, max: 1_000_000n }),
        fc.bigInt({ min: 1n, max: 1_000_000n }),
        (numerator, denominator) => {
          const ratio = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          for (const exponent of factorOddPrimes(ratio).values()) {
            expect(exponent).not.toBe(0);
          }
        },
      ),
    );
  });

  it("is invariant under multiplication by powers of 2", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n, max: 1_000_000n }),
        fc.bigInt({ min: 1n, max: 1_000_000n }),
        fc.integer({ min: 1, max: 20 }),
        (numerator, denominator, exponent) => {
          const factor = 2n ** BigInt(exponent);

          const original = createRatio(
            createPositiveInteger(numerator),
            createPositiveInteger(denominator),
          );

          const octaveEquivalent = createRatio(
            createPositiveInteger(numerator * factor),
            createPositiveInteger(denominator),
          );

          expect(factorOddPrimes(octaveEquivalent)).toEqual(
            factorOddPrimes(original),
          );
        },
      ),
    );
  });
});
