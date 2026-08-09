import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartialClass } from "./partialClass";
import { positiveOddBigIntArbitrary } from "./test/partialClassArbitraries";

describe("createPartialClass properties", () => {
  it("preserves every positive odd bigint", () => {
    fc.assert(
      fc.property(positiveOddBigIntArbitrary, (value) => {
        expect(createPartialClass(value)).toBe(value);
      }),
    );
  });

  it("rejects every positive even bigint", () => {
    fc.assert(
      fc.property(positiveOddBigIntArbitrary, (value) => {
        const evenValue = value * 2n;

        expect(() => createPartialClass(evenValue)).toThrow(
          "Expected an odd positive bigint",
        );
      }),
    );
  });

  it("rejects every non-positive bigint", () => {
    fc.assert(
      fc.property(fc.bigInt({ max: 0n }), (value) => {
        expect(() => createPartialClass(value)).toThrow(
          "Expected a positive bigint",
        );
      }),
    );
  });
});
