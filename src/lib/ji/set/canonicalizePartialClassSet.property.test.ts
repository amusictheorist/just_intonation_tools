import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "../partial/partialClass";
import { canonicalizePartialClassSet } from "./canonicalizePartialClassSet";
import { positiveOddBigIntArbitrary } from "../test/partialClassArbitraries";
import { partialClassSetArbitrary } from "../test/partialClassSetArbitraries";
import type { PositiveInteger } from "../integer/positiveInteger";
import { greatestCommonDivisor } from "../integer/greatestCommonDivisor";

describe("canonicalizePartialClassSet properties", () => {
  it("is idempotent", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        const canonical = canonicalizePartialClassSet(partialClassSet);

        expect(canonicalizePartialClassSet(canonical)).toEqual(canonical);
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

          expect(canonicalizePartialClassSet(scaledPartialClassSet)).toEqual(
            canonicalizePartialClassSet(partialClassSet),
          );
        },
      ),
    );
  });

  it("produces a representative whose members have greatest common divisor 1n", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        const canonical = canonicalizePartialClassSet(partialClassSet);

        let divisor: PositiveInteger = canonical.members[0];

        for (const member of canonical.members.slice(1)) {
          divisor = greatestCommonDivisor(divisor, member);
        }

        expect(divisor).toBe(1n);
      }),
    );
  });
});
