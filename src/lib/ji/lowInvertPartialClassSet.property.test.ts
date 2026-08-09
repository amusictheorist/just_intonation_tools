import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { lowInvertPartialClassSet } from "./lowInvertPartialClassSet";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";
import { partialClassArbitrary } from "./test/partialClassArbitraries";
import { partialClassSetArbitrary } from "./test/partialClassSetArbitraries";

describe("lowInvertPartialClassSet properties", () => {
  it("returns 1n for every singleton partial-class set", () => {
    fc.assert(
      fc.property(partialClassArbitrary, (partialClass) => {
        const partialClassSet = createPartialClassSet([partialClass]);

        expect(lowInvertPartialClassSet(partialClassSet).members).toEqual([1n]);
      }),
    );
  });

  it("preserves cardinality", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        expect(lowInvertPartialClassSet(partialClassSet).members).toHaveLength(
          partialClassSet.members.length,
        );
      }),
    );
  });

  it("is involutive up to partial-class-set equivalence", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        const twiceInverted = lowInvertPartialClassSet(
          lowInvertPartialClassSet(partialClassSet),
        );

        expect(
          arePartialClassSetsEquivalent(partialClassSet, twiceInverted),
        ).toBe(true);
      }),
    );
  });
});
