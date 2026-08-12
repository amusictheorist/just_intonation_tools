import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "./arbitraries/primeExponentsArbitrary";
import { createRadialAddress } from "./createRadialAddress";
import { createCanonicalPrimeFactorPath } from "./createCanonicalPrimeFactorPath";

describe("createRadialAddress properties", () => {
  it("uses the canonical prime-factor path", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const address = createRadialAddress(factors);

        expect(address.path).toEqual(createCanonicalPrimeFactorPath(factors));
      }),
    );
  });

  it("distance to the number of prime-factor steps", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const address = createRadialAddress(factors);

        expect(address.distance).toBe(address.path.length);
      }),
    );
  });
});
