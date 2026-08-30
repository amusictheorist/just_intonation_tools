import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "../partial/partial";

describe("createPartialSet properties", () => {
  it("removes duplicate members", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));

          expect(new Set(partialSet.members).size).toBe(
            partialSet.members.length,
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
          const original = createPartialSet(values.map(createPartial));
          const reversed = createPartialSet(
            [...values].reverse().map(createPartial),
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
          const partialSet = createPartialSet(values.map(createPartial));

          expect(createPartialSet(partialSet.members)).toEqual(partialSet);
        },
      ),
    );
  });

  it("stores only positive partial values", () => {
    fc.assert(
      fc.property(
        fc.array(fc.bigInt({ min: 1n }), { minLength: 1 }),
        (values) => {
          const partialSet = createPartialSet(values.map(createPartial));

          expect(partialSet.members.every((member) => member > 0n)).toBe(true);
        },
      ),
    );
  });
});
