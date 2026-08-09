import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { createPositiveInteger } from "./positiveInteger";

describe("createPositiveInteger properties", () => {
  it("preserves every positive bigint", () => {
    fc.assert(
      fc.property(fc.bigInt({ min: 1n }), (value) => {
        expect(createPositiveInteger(value)).toBe(value);
      }),
    );
  });

  it("rejects every non-positive bigint", () => {
    fc.assert(
      fc.property(fc.bigInt({ max: 0n }), (value) => {
        expect(() => createPositiveInteger(value)).toThrow(
          "Expected a positive bigint",
        );
      }),
    );
  });
});
