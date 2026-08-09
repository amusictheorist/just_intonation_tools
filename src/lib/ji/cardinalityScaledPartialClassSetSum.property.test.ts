import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { cardinalityScaledPartialClassSetSum } from "./cardinalityScaledPartialClassSetSum";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";
import { createPartialClass } from "./partialClass";

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
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );
          const scale = createPositiveInteger(scaleValue * 2n - 1n);

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
