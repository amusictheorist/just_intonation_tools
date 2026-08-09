import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClass } from "./partialClass";
import { transposePartialClassSet } from "./transposePartialClassSet";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";
import { partialClassArbitrary } from "./test/partialClassArbitraries";
import { partialClassSetArbitrary } from "./test/partialClassSetArbitraries";

describe("transposePartialClassSet properties", () => {
  it("is the identity under transposition by 1", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        const factor = createPartialClass(1n);

        expect(transposePartialClassSet(partialClassSet, factor)).toEqual(
          partialClassSet,
        );
      }),
    );
  });

  it("preserves cardinality under positive odd transposition", () => {
    fc.assert(
      fc.property(
        partialClassSetArbitrary,
        partialClassArbitrary,
        (partialClassSet, factor) => {
          const transposed = transposePartialClassSet(partialClassSet, factor);

          expect(transposed.members).toHaveLength(
            partialClassSet.members.length,
          );
        },
      ),
    );
  });

  it("preserves partial-class-set class membership", () => {
    fc.assert(
      fc.property(
        partialClassSetArbitrary,
        partialClassArbitrary,
        (partialClassSet, factor) => {
          const transposed = transposePartialClassSet(partialClassSet, factor);

          expect(
            arePartialClassSetsEquivalent(partialClassSet, transposed),
          ).toBe(true);
        },
      ),
    );
  });

  it("composes transpositions multiplicatively", () => {
    fc.assert(
      fc.property(
        partialClassSetArbitrary,
        partialClassArbitrary,
        partialClassArbitrary,
        (partialClassSet, firstFactor, secondFactor) => {
          const combinedFactor = createPartialClass(firstFactor * secondFactor);

          const twiceTransposed = transposePartialClassSet(
            transposePartialClassSet(partialClassSet, firstFactor),
            secondFactor,
          );

          expect(twiceTransposed).toEqual(
            transposePartialClassSet(partialClassSet, combinedFactor),
          );
        },
      ),
    );
  });
});
