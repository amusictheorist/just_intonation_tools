import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { factorableRatioArbitrary } from "../../ji/test/ratioArbitraries";
import { createExpandedRadialAddress } from "./createExpandedRadialAddress";
import { normalizeExpandedRadialRatio } from "./normalizeExpandedRadialRatio";
import { factorPrimesIgnoringTwo } from "./factorPrimesIgnoringTwo";
import { createCanonicalPrimeFactorPath } from "./createCanonicalPrimeFactorPath";

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

  it("derives side from the normalized ratio", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);

        const expectedSide =
          address.normalizedRatio.numerator >=
          address.normalizedRatio.denominator
            ? "upper"
            : "lower";

        expect(address.side).toBe(expectedSide);
      }),
    );
  });

  it("uses the canonical prime-factor path of the normalized ratio", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);
        const factors = factorPrimesIgnoringTwo(address.normalizedRatio);

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
