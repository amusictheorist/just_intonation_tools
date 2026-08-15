import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { positiveIntegerArbitrary } from "../../ji/test/positiveIntegerArbitraries";
import { parseLatticeRatioInput } from "./parseLatticeRatioInput";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("parseLatticeRatioInput properties", () => {
  it("parses arbitrary positive integer ratio terms through the shared ratio domain", () => {
    fc.assert(
      fc.property(
        positiveIntegerArbitrary,
        positiveIntegerArbitrary,
        (numerator, denominator) => {
          expect(parseLatticeRatioInput(`${numerator}/${denominator}`)).toEqual(
            {
              success: true,
              ratio: createTestRatio(numerator, denominator),
            },
          );
        },
      ),
    );
  });
});
