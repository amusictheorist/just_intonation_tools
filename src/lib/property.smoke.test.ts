import fc from "fast-check";
import { describe, expect, it } from "vitest";

describe("property-test infrastructure", () => {
  it("runs generated properties with fast-check", () => {
    fc.assert(
      fc.property(fc.integer(), (value) => {
        expect(value + 0).toBe(value);
      }),
    );
  });
});
