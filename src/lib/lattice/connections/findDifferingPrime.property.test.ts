import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "../symbolic/arbitraries/primeExponentsArbitrary";
import { findDifferingPrime } from "./findDifferingPrime";

describe("findDifferingPrime properties", () => {
  it("is symmetric", () => {
    fc.assert(
      fc.property(
        primeExponentsArbitrary,
        primeExponentsArbitrary,
        (first, second) => {
          expect(findDifferingPrime(first, second)).toBe(
            findDifferingPrime(second, first),
          );
        },
      ),
    );
  });

  it("returns null for identical positions", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (exponents) => {
        expect(findDifferingPrime(exponents, exponents)).toBeNull();
      }),
    );
  });
});
