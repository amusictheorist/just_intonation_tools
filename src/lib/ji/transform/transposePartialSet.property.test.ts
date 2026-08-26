import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { transposePartialSet } from "./transposePartialSet";
import { arePartialSetsEquivalent } from "../set/arePartialSetsEquivalent";
import { partialSetArbitrary } from "../test/partialSetArbitraries";
import { positiveIntegerArbitrary } from "../test/positiveIntegerArbitraries";
import { createPositiveInteger } from "../integer/positiveInteger";

describe("transposePartialSet properties", () => {
  it("is the identity under transposition by 1", () => {
    fc.assert(
      fc.property(partialSetArbitrary, (partialSet) => {
        const factor = createPositiveInteger(1n);

        expect(transposePartialSet(partialSet, factor)).toEqual(partialSet);
      }),
    );
  });

  it("preserves cardinality under positive transposition", () => {
    fc.assert(
      fc.property(
        partialSetArbitrary,
        positiveIntegerArbitrary,
        (partialSet, factor) => {
          const transposed = transposePartialSet(partialSet, factor);

          expect(transposed.members).toHaveLength(partialSet.members.length);
        },
      ),
    );
  });

  it("preserves partial-set class membership", () => {
    fc.assert(
      fc.property(
        partialSetArbitrary,
        positiveIntegerArbitrary,
        (partialSet, factor) => {
          const transposed = transposePartialSet(partialSet, factor);

          expect(arePartialSetsEquivalent(partialSet, transposed)).toBe(true);
        },
      ),
    );
  });

  it("composes transpositions multiplicatively", () => {
    fc.assert(
      fc.property(
        partialSetArbitrary,
        positiveIntegerArbitrary,
        positiveIntegerArbitrary,
        (partialSet, firstFactor, secondFactor) => {
          const combinedFactor = createPositiveInteger(
            firstFactor * secondFactor,
          );

          const twiceTransposed = transposePartialSet(
            transposePartialSet(partialSet, firstFactor),
            secondFactor,
          );

          expect(twiceTransposed).toEqual(
            transposePartialSet(partialSet, combinedFactor),
          );
        },
      ),
    );
  });
});
