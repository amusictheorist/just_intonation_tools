import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "../partial/partialClass";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";
import { positiveOddBigIntArbitrary } from "../test/partialClassArbitraries";
import { partialClassSetArbitrary } from "../test/partialClassSetArbitraries";

describe("arePartialClassSetsEquivalent properties", () => {
  it("is reflexive", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        expect(
          arePartialClassSetsEquivalent(partialClassSet, partialClassSet),
        ).toBe(true);
      }),
    );
  });

  it("is symmetric", () => {
    fc.assert(
      fc.property(
        partialClassSetArbitrary,
        partialClassSetArbitrary,
        (left, right) => {
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
        partialClassSetArbitrary,
        positiveOddBigIntArbitrary,
        (partialClassSet, scale) => {
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
        partialClassSetArbitrary,
        positiveOddBigIntArbitrary,
        positiveOddBigIntArbitrary,
        (base, firstScale, secondScale) => {
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
