import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "../set/partialClassSet";
import { cardinalityScaledPartialClassSetSum } from "./cardinalityScaledPartialClassSetSum";
import { createPartialClass } from "../partial/partialClass";
import { positiveOddBigIntArbitrary } from "../test/partialClassArbitraries";
import { partialClassSetArbitrary } from "../test/partialClassSetArbitraries";
import { createUnisonRatio } from "../ratio/createUnisonRatio";

describe("cardinalityScaledPartialClassSetSum properties", () => {
  it("returns 1 for the simplest partial-class-set class of every cardinality", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (cardinality) => {
        const partialClassSet = createPartialClassSet(
          Array.from({ length: cardinality }, (_, index) =>
            createPartialClass(BigInt(index * 2 + 1)),
          ),
        );

        expect(cardinalityScaledPartialClassSetSum(partialClassSet)).toEqual(
          createUnisonRatio(),
        );
      }),
    );
  });

  it("is invariant under common positive odd scaling", () => {
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
            cardinalityScaledPartialClassSetSum(scaledPartialClassSet),
          ).toEqual(cardinalityScaledPartialClassSetSum(partialClassSet));
        },
      ),
    );
  });
});
