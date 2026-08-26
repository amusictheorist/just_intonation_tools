import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "../set/partialSet";
import { lowInvertPartialSet } from "./lowInvertPartialSet";
import { arePartialSetsEquivalent } from "../set/arePartialSetsEquivalent";
import { partialArbitrary } from "../test/partialArbitraries";
import { partialSetArbitrary } from "../test/partialSetArbitraries";

describe("lowInvertPartialSet properties", () => {
  it("returns 1n for every singleton partial set", () => {
    fc.assert(
      fc.property(partialArbitrary, (partial) => {
        const partialSet = createPartialSet([partial]);

        expect(lowInvertPartialSet(partialSet).members).toEqual([1n]);
      }),
    );
  });

  it("preserves cardinality", () => {
    fc.assert(
      fc.property(partialSetArbitrary, (partialSet) => {
        expect(lowInvertPartialSet(partialSet).members).toHaveLength(
          partialSet.members.length,
        );
      }),
    );
  });

  it("is involutive up to partial-set equivalence", () => {
    fc.assert(
      fc.property(partialSetArbitrary, (partialSet) => {
        const twiceInverted = lowInvertPartialSet(
          lowInvertPartialSet(partialSet),
        );

        expect(arePartialSetsEquivalent(partialSet, twiceInverted)).toBe(true);
      }),
    );
  });
});
