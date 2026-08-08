import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { canonicalizePartialSet } from "./canonicalizePartialSet";
import type { PositiveInteger } from "./positiveInteger";
import { greatestCommonDivisor } from "./greatestCommonDivisor";

describe("canonicalizePartialSet properties", () => {
  it("is idempotent", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));

          const canonical = canonicalizePartialSet(partialSet);

          expect(canonicalizePartialSet(canonical)).toEqual(canonical);
        },
      ),
    );
  });

  it("is invariant under common positive scaling", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        fc.bigInt({ min: 1n }),
        (values, scale) => {
          const partialSet = createPartialSet(values.map(createPartial));

          const scaledPartialSet = createPartialSet(
            values.map((value) => createPartial(value * scale)),
          );

          expect(canonicalizePartialSet(scaledPartialSet)).toEqual(
            canonicalizePartialSet(partialSet),
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
          const partialSet = createPartialSet(values.map(createPartial));
          const canonical = canonicalizePartialSet(partialSet);

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
