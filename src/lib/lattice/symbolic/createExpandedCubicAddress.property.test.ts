import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "./arbitraries/primeExponentsArbitrary";
import { createExpandedCubicAddress } from "./createExpandedCubicAddress";

describe("createExpandedCubicAddress propertis", () => {
  it("uses only primes above 7 in the anchor path", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const address = createExpandedCubicAddress(factors);

        for (const step of address.anchorPath) {
          expect(step.prime > 7n).toBe(true);
        }
      }),
    );
  });

  it("maps only 3, 5, and 7 exponents to local cubic coordinates", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const address = createExpandedCubicAddress(factors);

        expect(address.coordinates357).toEqual({
          x: factors.get(3n) ?? 0,
          y: factors.get(5n) ?? 0,
          z: factors.get(7n) ?? 0,
        });
      }),
    );
  });

  it("creates one anchor step for each higher-prime factor occurrence", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const address = createExpandedCubicAddress(factors);

        const expectedAnchorSteps = [...factors.entries()]
          .filter(([prime]) => prime > 7n)
          .reduce((sum, [, exponent]) => sum + Math.abs(exponent), 0);

        expect(address.anchorPath).toHaveLength(expectedAnchorSteps);
      }),
    );
  });
});
