import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { partialSetToPartialClassSet } from "./partialSetToPartialClassSet";

describe("parialSetToPartialClassSet properties", () => {
  it("is invariant when every partial is multiplied by the same power of 2n", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.integer({ min: 0, max: 64 }),
        (values, exponent) => {
          const partialSet = createPartialSet(values.map(createPartial));

          const octaveEquivalentSet = createPartialSet(
            values.map((value) =>
              createPartial(value * 2n ** BigInt(exponent)),
            ),
          );

          expect(partialSetToPartialClassSet(octaveEquivalentSet)).toEqual(
            partialSetToPartialClassSet(partialSet),
          );
        },
      ),
    );
  });

  it("always returns unique positive odd partial classes", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));
          const partialClassSet = partialSetToPartialClassSet(partialSet);

          expect(new Set(partialClassSet.members).size).toBe(
            partialClassSet.members.length,
          );

          expect(
            partialClassSet.members.every(
              (member) => member > 0n && member % 2n === 1n,
            ),
          ).toBe(true);
        },
      ),
    );
  });

  it("produces the same partial-class set from equivalent input orderings", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const original = createPartialSet(values.map(createPartial));
          const reversed = createPartialSet(
            [...values].reverse().map(createPartial),
          );

          expect(partialSetToPartialClassSet(reversed)).toEqual(
            partialSetToPartialClassSet(original),
          );
        },
      ),
    );
  });
});
