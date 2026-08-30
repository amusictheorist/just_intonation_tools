import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { factorableRatioArbitrary } from "../../../ji/test/ratioArbitraries";
import { factorPrimesIgnoringTwo } from "../factorPrimesIgnoringTwo";
import { createCanonicalPrimeFactorPath } from "../createCanonicalPrimeFactorPath";
import { createExpandedRadialAddress } from "./createExpandedRadialAddress";
import { normalizeExpandedRadialRatio } from "./normalizeExpandedRadialRatio";

describe("createExpandedRadialAddress properties", () => {
  it("uses side-preserving expanded-radial normalization", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);

        expect(address.normalizedRatio).toEqual(
          normalizeExpandedRadialRatio(ratio),
        );
      }),
    );
  });

  it("preserves the original ratio's side of unison", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);

        const expectedSide =
          ratio.numerator >= ratio.denominator ? "upper" : "lower";

        expect(address.side).toBe(expectedSide);
      }),
    );
  });

  it("uses the canonical prime-factor path of the original ratio", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);
        const factors = factorPrimesIgnoringTwo(ratio);

        expect(address.path).toEqual(createCanonicalPrimeFactorPath(factors));
      }),
    );
  });

  it("sets distance to the number of prime-factor steps", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);

        expect(address.distance).toBe(address.path.length);
      }),
    );
  });
});
