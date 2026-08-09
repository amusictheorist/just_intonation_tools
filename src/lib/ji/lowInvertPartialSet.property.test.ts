import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { lowInvertPartialSet } from "./lowInvertPartialSet";
import { arePartialSetsEquivalent } from "./arePartialSetsEquivalent";

describe("lowInvertPartialSet properties", () => {
  it("returns 1n for every singleton partial set", () => {
    fc.assert(
      fc.property(fc.bigInt({ min: 1n }), (value) => {
        const partialSet = createPartialSet([createPartial(value)]);

        expect(lowInvertPartialSet(partialSet).members).toEqual([1n]);
      }),
    );
  });

  it("preserves cardinality", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));

          expect(lowInvertPartialSet(partialSet).members).toHaveLength(
            partialSet.members.length,
          );
        },
      ),
    );
  });

  it("is involutive up to partial-set equivalence", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));

          const twiceInverted = lowInvertPartialSet(
            lowInvertPartialSet(partialSet),
          );

          expect(arePartialSetsEquivalent(partialSet, twiceInverted)).toBe(
            true,
          );
        },
      ),
    );
  });
});
