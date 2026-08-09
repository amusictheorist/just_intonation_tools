import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { createPositiveInteger } from "./positiveInteger";
import { canonicalPartialSetSum } from "./canonicalPartialSetSum";

describe("canonicalPartialSetSum properties", () => {
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

          expect(canonicalPartialSetSum(scaledPartialSet)).toBe(
            canonicalPartialSetSum(partialSet),
          );
        },
      ),
    );
  });

  it("always returns a positive bigint", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));

          expect(canonicalPartialSetSum(partialSet)).toBeGreaterThan(0n);
        },
      ),
    );
  });
});
