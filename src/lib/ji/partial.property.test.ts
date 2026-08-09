import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartial } from "./partial";

describe("createPartial properties", () => {
  it("preserves every positive bigint", () => {
    fc.assert(
      fc.property(fc.bigInt({ min: 1n }), (value) => {
        expect(createPartial(value)).toBe(value);
      }),
    );
  });

  it("rejects every non-positive bigint", () => {
    fc.assert(
      fc.property(fc.bigInt({ max: 0n }), (value) => {
        expect(() => createPartial(value)).toThrow(
          "Expected a positive bigint",
        );
      }),
    );
  });
});
