import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { createPositiveInteger } from "./positiveInteger";
import { canonicalPartialClassSetSum } from "./canonicalPartialClassSetSum";

describe("canonicalPartialClassSetSum properties", () => {
  it("is invariant under common positive odd scaling", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, scaleSeed) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );
          const scale = createPositiveInteger(scaleSeed * 2n - 1n);

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
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          expect(canonicalPartialClassSetSum(partialClassSet)).toBeGreaterThan(
            0n,
          );
        },
      ),
    );
  });
});
