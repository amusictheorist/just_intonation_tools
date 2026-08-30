import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "../partial/partialClass";
import { positiveOddBigIntArbitrary } from "../test/partialClassArbitraries";

describe("createPartialClassSet properties", () => {
  it("removes duplicate members", () => {
    fc.assert(
      fc.property(
        fc.array(positiveOddBigIntArbitrary, { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map(createPartialClass),
          );

          expect(new Set(partialClassSet.members).size).toBe(
            partialClassSet.members.length,
          );
        },
      ),
    );
  });

  it("normalizes equivalent inputs deterministically", () => {
    fc.assert(
      fc.property(
        fc.array(positiveOddBigIntArbitrary, { minLength: 1 }),
        (values) => {
          const original = createPartialClassSet(
            values.map(createPartialClass),
          );
          const reversed = createPartialClassSet(
            [...values].reverse().map(createPartialClass),
          );

          expect(reversed).toEqual(original);
        },
      ),
    );
  });

  it("is idempotent", () => {
    fc.assert(
      fc.property(
        fc.array(positiveOddBigIntArbitrary, { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map(createPartialClass),
          );

          expect(createPartialClassSet(partialClassSet.members)).toEqual(
            partialClassSet,
          );
        },
      ),
    );
  });

  it("stores only positive odd partial-class values", () => {
    fc.assert(
      fc.property(
        fc.array(positiveOddBigIntArbitrary, { minLength: 1 }),
        (values) => {
          const partialClassSet = createPartialClassSet(
            values.map(createPartialClass),
          );

          expect(
            partialClassSet.members.every(
              (member) => member > 0n && member % 2n === 1n,
            ),
          ).toBe(true);
        },
      ),
    );
  });
});
