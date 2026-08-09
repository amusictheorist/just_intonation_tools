import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { createPositiveInteger } from "./positiveInteger";
import { transposePartialSet } from "./transposePartialSet";
import { arePartialSetsEquivalent } from "./arePartialSetsEquivalent";

describe("transposePartialSet properties", () => {
  it("is the identity under transposition by 1", () => [
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));
          const factor = createPositiveInteger(1n);

          expect(transposePartialSet(partialSet, factor)).toEqual(partialSet);
        },
      ),
    ),
  ]);

  it("preserves cardinality under positive transposition", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, factorValue) => {
          const partialSet = createPartialSet(values.map(createPartial));
          const factor = createPositiveInteger(factorValue);

          const transposed = transposePartialSet(partialSet, factor);

          expect(transposed.members).toHaveLength(partialSet.members.length);
        },
      ),
    );
  });

  it("preserves partial-set class membership", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, factorValue) => {
          const partialSet = createPartialSet(values.map(createPartial));
          const factor = createPositiveInteger(factorValue);

          const transposed = transposePartialSet(partialSet, factor);

          expect(arePartialSetsEquivalent(partialSet, transposed)).toBe(true);
        },
      ),
    );
  });

  it("composes transpositions multiplicatively", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (values, firstFactorValue, secondFactorValue) => {
          const partialSet = createPartialSet(values.map(createPartial));
          const firstFactor = createPositiveInteger(firstFactorValue);
          const secondFactor = createPositiveInteger(secondFactorValue);
          const combinedFactor = createPositiveInteger(
            firstFactorValue * secondFactorValue,
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
