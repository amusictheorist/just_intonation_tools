import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartial } from "./partial";
import { partialToPartialClass } from "./partialToPartialClass";
import { partialArbitrary } from "../test/partialArbitraries";

describe("partialToPartialClass properties", () => {
  it("is invariant under multiplication by powers of 2n", () => {
    fc.assert(
      fc.property(
        partialArbitrary,
        fc.integer({ min: 0, max: 64 }),
        (partial, exponent) => {
          const octaveEquivalentPartial = createPartial(
            partial * 2n ** BigInt(exponent),
          );

          expect(partialToPartialClass(octaveEquivalentPartial)).toBe(
            partialToPartialClass(partial),
          );
        },
      ),
    );
  });

  it("always returns a positive odd bigint", () => {
    fc.assert(
      fc.property(partialArbitrary, (partial) => {
        const partialClass = partialToPartialClass(partial);

        expect(partialClass > 0n).toBe(true);
        expect(partialClass % 2n).toBe(1n);
      }),
    );
  });
});
