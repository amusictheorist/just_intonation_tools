import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "../partial/partial";
import { arePartialSetsEquivalent } from "./arePartialSetsEquivalent";
import { partialSetArbitrary } from "../test/partialSetArbitraries";
import { positiveIntegerArbitrary } from "../test/positiveIntegerArbitraries";

describe("arePartialSetsEquivalent properties", () => {
  it("is reflexive", () => {
    fc.assert(
      fc.property(partialSetArbitrary, (partialSet) => {
        expect(arePartialSetsEquivalent(partialSet, partialSet)).toBe(true);
      }),
    );
  });

  it("is symmetric", () => {
    fc.assert(
      fc.property(partialSetArbitrary, partialSetArbitrary, (left, right) => {
        expect(arePartialSetsEquivalent(left, right)).toBe(
          arePartialSetsEquivalent(right, left),
        );
      }),
    );
  });

  it("preserves equivalence under common positive scaling", () => {
    fc.assert(
      fc.property(
        partialSetArbitrary,
        positiveIntegerArbitrary,
        (partialSet, scale) => {
          const scaledPartialSet = createPartialSet(
            partialSet.members.map((member) => createPartial(member * scale)),
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
        partialSetArbitrary,
        positiveIntegerArbitrary,
        positiveIntegerArbitrary,
        (base, firstScale, secondScale) => {
          const middle = createPartialSet(
            base.members.map((member) => createPartial(member * firstScale)),
          );
          const right = createPartialSet(
            middle.members.map((member) => createPartial(member * secondScale)),
          );
          expect(arePartialSetsEquivalent(base, middle)).toBe(true);
          expect(arePartialSetsEquivalent(middle, right)).toBe(true);
          expect(arePartialSetsEquivalent(base, right)).toBe(true);
        },
      ),
    );
  });
});
