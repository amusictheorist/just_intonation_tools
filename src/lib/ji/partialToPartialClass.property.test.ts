import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartial } from "./partial";
import { partialToPartialClass } from "./partialToPartialClass";

describe("partialToPartialClass properties", () => {
  it("is invariant under multiplication by powers of 2n", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.integer({ min: 0, max: 64 }),
        (value, exponent) => {
          const partial = createPartial(value);
          const octaveEquivalentPartial = createPartial(
            value * 2n ** BigInt(exponent),
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
      fc.property(fc.bigInt({ min: 1n }), (value) => {
        const partialClass = partialToPartialClass(createPartial(value));

        expect(partialClass > 0n).toBe(true);
        expect(partialClass % 2n).toBe(1n);
      }),
    );
  });
});
