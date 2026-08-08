import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { arePartialSetsEquivalent } from "./arePartialSetsEquivalent";

describe("arePartialSetsEquivalent properties", () => {
  it("is reflexive", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));

          expect(arePartialSetsEquivalent(partialSet, partialSet)).toBe(true);
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
          const left = createPartialSet(leftValues.map(createPartial));
          const right = createPartialSet(rightValues.map(createPartial));

          expect(arePartialSetsEquivalent(left, right)).toBe(
            arePartialSetsEquivalent(right, left),
          );
        },
      ),
    );
  });

  it("preserves equivalence under common positive scaling", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, scale) => {
          const partialSet = createPartialSet(values.map(createPartial));

          const scaledPartialSet = createPartialSet(
            values.map((value) => createPartial(value * scale)),
          );

          expect(arePartialSetsEquivalent(partialSet, scaledPartialSet)).toBe(
            true,
          );
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
        (values, firstScale, secondScale) => {
          const base = createPartialSet(values.map(createPartial));

          const middle = createPartialSet(
            values.map((value) => createPartial(value * firstScale)),
          );

          const right = createPartialSet(
            values.map((value) =>
              createPartial(value * firstScale * secondScale),
            ),
          );

          expect(arePartialSetsEquivalent(base, middle)).toBe(true);
          expect(arePartialSetsEquivalent(middle, right)).toBe(true);
          expect(arePartialSetsEquivalent(base, right)).toBe(true);
        },
      ),
    );
  });
});
