import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "../set/partialClassSet";
import { createPartialClass } from "../partial/partialClass";
import { canonicalPartialClassSetSum } from "./canonicalPartialClassSetSum";
import { positiveOddBigIntArbitrary } from "../test/partialClassArbitraries";
import { partialClassSetArbitrary } from "../test/partialClassSetArbitraries";

describe("canonicalPartialClassSetSum properties", () => {
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

          expect(canonicalPartialClassSetSum(scaledPartialClassSet)).toBe(
            canonicalPartialClassSetSum(partialClassSet),
          );
        },
      ),
    );
  });

  it("always returns a positive bigint", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        expect(canonicalPartialClassSetSum(partialClassSet)).toBeGreaterThan(
          0n,
        );
      }),
    );
  });
});
