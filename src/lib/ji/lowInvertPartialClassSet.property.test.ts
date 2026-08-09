import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { lowInvertPartialClassSet } from "./lowInvertPartialClassSet";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";

describe("lowInvertPartialClassSet properties", () => {
  it("returns 1n for every singleton partial-class set", () => {
    fc.assert(
      fc.property(fc.bigInt({ min: 1n }), (value) => {
        const partialClassSet = createPartialClassSet([
          createPartialClass(value * 2n - 1n),
        ]);

        expect(lowInvertPartialClassSet(partialClassSet).members).toEqual([1n]);
      }),
    );
  });

  it("preserves cardinality", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          expect(
            lowInvertPartialClassSet(partialClassSet).members,
          ).toHaveLength(partialClassSet.members.length);
        },
      ),
    );
  });

  it("is involutive up to partial-class-set equivalence", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          const twiceInverted = lowInvertPartialClassSet(
            lowInvertPartialClassSet(partialClassSet),
          );

          expect(
            arePartialClassSetsEquivalent(partialClassSet, twiceInverted),
          ).toBe(true);
        },
      ),
    );
  });
});
