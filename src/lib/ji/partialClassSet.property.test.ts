import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";

describe("createPartialClassSet properties", () => {
  it("removes duplicate members", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const oddValues = values.map((value) => value * 2n - 1n);
          const partialClassSet = createPartialClassSet(
            oddValues.map(createPartialClass),
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
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const oddValues = values.map((value) => value * 2n - 1n);
          const original = createPartialClassSet(
            oddValues.map(createPartialClass),
          );
          const reversed = createPartialClassSet(
            [...oddValues].reverse().map(createPartialClass),
          );

          expect(reversed).toEqual(original);
        },
      ),
    );
  });

  it("is idempotent", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const oddValues = values.map((value) => value * 2n - 1n);
          const partialClassSet = createPartialClassSet(
            oddValues.map(createPartialClass),
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
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const oddValues = values.map((value) => value * 2n - 1n);
          const partialClassSet = createPartialClassSet(
            oddValues.map(createPartialClass),
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
