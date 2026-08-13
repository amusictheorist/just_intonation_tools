import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { primeExponentsArbitrary } from "../symbolic/arbitraries/primeExponentsArbitrary";
import { createRadialAddress } from "../symbolic/createRadialAddress";
import { createRadialPosition } from "./createRadialPosition";

describe("createRadialPosition properties", () => {
  it("uses generator distance only when height is enabled", () => {
    fc.assert(
      fc.property(
        primeExponentsArbitrary,
        fc.boolean(),
        (factors, includeGeneratorHeight) => {
          const address = createRadialAddress(factors);
          const position = createRadialPosition(
            address,
            includeGeneratorHeight,
          );

          expect(position.y).toBe(
            includeGeneratorHeight ? address.distance : 0,
          );
        },
      ),
    );
  });
});
