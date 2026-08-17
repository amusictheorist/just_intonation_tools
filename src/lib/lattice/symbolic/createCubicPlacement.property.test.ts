import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "./arbitraries/primeExponentsArbitrary";
import type { PrimeExponents } from "./factorPrimesIgnoringTwo";
import { createRatio } from "../../ji/ratio";
import { createPositiveInteger } from "../../ji/positiveInteger";
import { createCubicPlacement } from "./createCubicPlacement";

describe("createCubicPlacement properties", () => {
  it("maps 3-5-7 prime exponents to cubic coordinates", () => {
    fc.assert(
      fc.property(
        primeExponentsArbitrary.filter((factors) =>
          [...factors.keys()].every((prime) => prime <= 7n),
        ),
        (factors) => {
          const ratio = createRatioFromPrimeExponents(factors);

          expect(createCubicPlacement(ratio)).toEqual({
            x: factors.get(3n) ?? 0,
            y: factors.get(5n) ?? 0,
            z: factors.get(7n) ?? 0,
          });
        },
      ),
    );
  });

  it("returns null when a higher-prime factor is present", () => {
    fc.assert(
      fc.property(
        primeExponentsArbitrary.filter((factors) =>
          [...factors.keys()].some((prime) => prime > 7n),
        ),
        (factors) => {
          const ratio = createRatioFromPrimeExponents(factors);

          expect(createCubicPlacement(ratio)).toBeNull();
        },
      ),
    );
  });
});

function createRatioFromPrimeExponents(factors: PrimeExponents) {
  let numerator = 1n;
  let denominator = 1n;

  for (const [prime, exponent] of factors) {
    if (exponent > 0) {
      numerator *= prime ** BigInt(exponent);
      continue;
    }

    denominator *= prime ** BigInt(-exponent);
  }

  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}
