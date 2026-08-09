import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { transposePartialClassSet } from "./transposePartialClassSet";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";

describe("transposePartialClassSet properties", () => {
  it("is the identity under transposition by 1", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );
          const factor = createPartialClass(1n);

          expect(transposePartialClassSet(partialClassSet, factor)).toEqual(
            partialClassSet,
          );
        },
      ),
    );
  });

  it("preserves cardinality under positive transposition", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, factorSeed) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );
          const factor = createPartialClass(factorSeed * 2n - 1n);

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
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, factorSeed) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );
          const factor = createPartialClass(factorSeed * 2n - 1n);

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
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (values, firstFactorSeed, secondFactorSeed) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );
          const firstFactor = createPartialClass(firstFactorSeed * 2n - 1n);
          const secondFactor = createPartialClass(secondFactorSeed * 2n - 1n);
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
