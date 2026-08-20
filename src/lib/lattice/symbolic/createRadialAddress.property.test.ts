import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "./arbitraries/primeExponentsArbitrary";
import { createRadialAddress } from "./createRadialAddress";
import { createCanonicalPrimeFactorPath } from "./createCanonicalPrimeFactorPath";
import { createUnisonRatio } from "../../ji/createUnisonRatio";

describe("createRadialAddress properties", () => {
  const normalizedRatio = createUnisonRatio();

  it("uses the canonical prime-factor path", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const address = createRadialAddress(normalizedRatio, factors);

        expect(address.path).toEqual(createCanonicalPrimeFactorPath(factors));
      }),
    );
  });

  it("sets distance to the number of prime-factor steps", () => {
    fc.assert(
      fc.property(primeExponentsArbitrary, (factors) => {
        const address = createRadialAddress(normalizedRatio, factors);

        expect(address.distance).toBe(address.path.length);
      }),
    );
  });
});
