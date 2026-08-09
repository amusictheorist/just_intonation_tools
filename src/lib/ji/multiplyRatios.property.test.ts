import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { ratioArbitrary } from "./test/ratioArbitraries";
import { multiplyRatios } from "./multiplyRatios";
import { createUnisonRatio } from "./createUnisonRatio";

describe("multiplyRatios properties", () => {
  it("preserves every ratio when multiplied by unison", () => {
    fc.assert(
      fc.property(ratioArbitrary, (ratio) => {
        expect(multiplyRatios(ratio, createUnisonRatio())).toEqual(ratio);
      }),
    );
  });

  it("is commutative", () => {
    fc.assert(
      fc.property(ratioArbitrary, ratioArbitrary, (left, right) => {
        expect(multiplyRatios(left, right)).toEqual(
          multiplyRatios(right, left),
        );
      }),
    );
  });
});
