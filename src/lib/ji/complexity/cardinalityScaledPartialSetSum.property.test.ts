import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "../set/partialSet";
import { createPartial } from "../partial/partial";
import { cardinalityScaledPartialSetSum } from "./cardinalityScaledPartialSetSum";
import { partialSetArbitrary } from "../test/partialSetArbitraries";
import { positiveIntegerArbitrary } from "../test/positiveIntegerArbitraries";
import { createUnisonRatio } from "../ratio/createUnisonRatio";

describe("cardinalityScaledPartialSetSum properties", () => {
  it("returns 1 for the simplest partial-set class of every cardinality", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (cardinality) => {
        const partialSet = createPartialSet(
          Array.from({ length: cardinality }, (_, index) =>
            createPartial(BigInt(index + 1)),
          ),
        );

        expect(cardinalityScaledPartialSetSum(partialSet)).toEqual(
          createUnisonRatio(),
        );
      }),
    );
  });

  it("is invariant under common positive scaling", () => {
    fc.assert(
      fc.property(
        partialSetArbitrary,
        positiveIntegerArbitrary,
        (partialSet, scale) => {
          const scaledPartialSet = createPartialSet(
            partialSet.members.map((member) => createPartial(member * scale)),
          );

          expect(cardinalityScaledPartialSetSum(scaledPartialSet)).toEqual(
            cardinalityScaledPartialSetSum(partialSet),
          );
        },
      ),
    );
  });
});
