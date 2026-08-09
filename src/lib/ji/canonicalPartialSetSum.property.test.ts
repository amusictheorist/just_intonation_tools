import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { canonicalPartialSetSum } from "./canonicalPartialSetSum";
import { partialSetArbitrary } from "./test/partialSetArbitraries";
import { positiveIntegerArbitrary } from "./test/positiveIntegerArbitraries";

describe("canonicalPartialSetSum properties", () => {
  it("is invariant under common positive scaling", () => {
    fc.assert(
      fc.property(
        partialSetArbitrary,
        positiveIntegerArbitrary,
        (partialSet, scale) => {
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
      fc.property(partialSetArbitrary, (partialSet) => {
        expect(canonicalPartialSetSum(partialSet)).toBeGreaterThan(0n);
      }),
    );
  });
});
