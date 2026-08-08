import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { canonicalizePartialClassSet } from "./canonicalizePartialClassSet";
import type { PositiveInteger } from "./positiveInteger";
import { greatestCommonDivisor } from "./greatestCommonDivisor";

describe("canonicalizePartialClassSet properties", () => {
  it("is idempotent", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          const canonical = canonicalizePartialClassSet(partialClassSet);

          expect(canonicalizePartialClassSet(canonical)).toEqual(canonical);
        },
      ),
    );
  });

  it("is invariant under common positive odd scaling", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, scaleSeed) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          const scale = scaleSeed * 2n - 1n;

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
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map((value) => createPartialClass(value * 2n - 1n)),
          );

          const canonical = canonicalizePartialClassSet(partialClassSet);

          let divisor: PositiveInteger = canonical.members[0];

          for (const member of canonical.members.slice(1)) {
            divisor = greatestCommonDivisor(divisor, member);
          }

          expect(divisor).toBe(1n);
        },
      ),
    );
  });
});
