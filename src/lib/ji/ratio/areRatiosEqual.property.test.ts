import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { ratioArbitrary } from "../test/ratioArbitraries";
import { positiveIntegerArbitrary } from "../test/positiveIntegerArbitraries";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "../integer/positiveInteger";
import { areRatiosEqual } from "./areRatiosEqual";

describe("areRatiosEqual properties", () => {
  it("treats commonly scaled ratios as equal", () => {
    fc.assert(
      fc.property(ratioArbitrary, positiveIntegerArbitrary, (ratio, factor) => {
        const scaled = createRatio(
          createPositiveInteger(ratio.numerator * factor),
          createPositiveInteger(ratio.denominator * factor),
        );
        expect(areRatiosEqual(ratio, scaled)).toBe(true);
      }),
    );
  });
});
