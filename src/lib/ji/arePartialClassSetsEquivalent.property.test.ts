import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";

describe("arePartialClassSetsEquivalent properties", () => {
  it("is reflexive", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          expect(
            arePartialClassSetsEquivalent(partialClassSet, partialClassSet),
          ).toBe(true);
        },
      ),
    );
  });

  it("is symmetric", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (leftValues, rightValues) => {
          const left = createPartialClassSet(
            leftValues.map((value) => createPartialClass(value * 2n - 1n)),
          );
          const right = createPartialClassSet(
            rightValues.map((value) => createPartialClass(value * 2n - 1n)),
          );

          expect(arePartialClassSetsEquivalent(left, right)).toBe(
            arePartialClassSetsEquivalent(right, left),
          );
        },
      ),
    );
  });

  it("preserves equivalence under common positive odd scaling", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, scaleSeed) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          const scale = scaleSeed * 2n - 1n;

          const scaledPartialClassSet = createPartialClassSet(
            partialClassSet.members.map((member) =>
              createPartialClass(member * scale),
            ),
          );

          expect(
            arePartialClassSetsEquivalent(
              partialClassSet,
              scaledPartialClassSet,
            ),
          ).toBe(true);
        },
      ),
    );
  });

  it("is transitive", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (values, firstScaleSeed, secondScaleSeed) => {
          const base = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          const firstScale = firstScaleSeed * 2n - 1n;
          const secondScale = secondScaleSeed * 2n - 1n;

          const middle = createPartialClassSet(
            base.members.map((member) =>
              createPartialClass(member * firstScale),
            ),
          );

          const right = createPartialClassSet(
            middle.members.map((member) =>
              createPartialClass(member * secondScale),
            ),
          );

          expect(arePartialClassSetsEquivalent(base, middle)).toBe(true);
          expect(arePartialClassSetsEquivalent(middle, right)).toBe(true);
          expect(arePartialClassSetsEquivalent(base, right)).toBe(true);
        },
      ),
    );
  });
});
