import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "../symbolic/arbitraries/primeExponentsArbitrary";
import { isPrimeAxisConnectionVisible } from "./isPrimeAxisConnectionVisible";

describe("isPrimeAxisConnectionVisible properties", () => {
  it("is unchanged when the endpoints are swapped", () => {
    fc.assert(
      fc.property(
        primeExponentsArbitrary,
        primeExponentsArbitrary,
        fc.array(primeExponentsArbitrary, { maxLength: 8 }),
        (first, second, others) => {
          expect(isPrimeAxisConnectionVisible(first, second, others)).toBe(
            isPrimeAxisConnectionVisible(second, first, others),
          );
        },
      ),
    );
  });

  it("is unchanged when other positions are reordered", () => {
    fc.assert(
      fc.property(
        primeExponentsArbitrary,
        primeExponentsArbitrary,
        fc.array(primeExponentsArbitrary, { maxLength: 8 }),
        (first, second, others) => {
          const reversedOthers = [...others].reverse();
          expect(isPrimeAxisConnectionVisible(first, second, others)).toBe(
            isPrimeAxisConnectionVisible(first, second, reversedOthers),
          );
        },
      ),
    );
  });
});
