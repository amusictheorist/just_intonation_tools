import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { cardinalityScaledPartialSetSum } from "./cardinalityScaledPartialSetSum";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";

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
          createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
        );
      }),
    );
  });

  it("is invariant under common positive scaling", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, scaleValue) => {
          const partialSet = createPartialSet(values.map(createPartial));
          const scale = createPositiveInteger(scaleValue);

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
