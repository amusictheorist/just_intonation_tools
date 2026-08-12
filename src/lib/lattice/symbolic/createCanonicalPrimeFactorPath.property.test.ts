import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "./arbitraries/primeExponentsArbitrary";
import { createCanonicalPrimeFactorPath } from "./createCanonicalPrimeFactorPath";

describe("createCanonicalPrimeFactorPath", () => {
  it("has one step for each prime-factor occurrence", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const path = createCanonicalPrimeFactorPath(factors);

        const expectedLength = [...factors.values()].reduce(
          (sum, exponent) => sum + Math.abs(exponent),
          0,
        );

        expect(path).toHaveLength(expectedLength);
      }),
    );
  });

  it("orders steps by ascending prime", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const path = createCanonicalPrimeFactorPath(factors);

        for (let index = 1; index < path.length; index++) {
          expect(path[index - 1].prime <= path[index].prime).toBe(true);
        }
      }),
    );
  });

  it("preserves each factor's multiplicity and direction", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const path = createCanonicalPrimeFactorPath(factors);

        for (const [prime, exponent] of factors) {
          const matchingSteps = path.filter((step) => step.prime === prime);
          const expectedDirection: 1 | -1 = exponent > 0 ? 1 : -1;

          expect(matchingSteps).toHaveLength(Math.abs(exponent));

          for (const step of matchingSteps) {
            expect(step.direction).toBe(expectedDirection);
          }
        }
      }),
    );
  });
});
