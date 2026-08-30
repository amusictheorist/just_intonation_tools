import { describe, expect, it } from "vitest";
import { createPositiveInteger } from "./positiveInteger";
import { leastCommonMultiple } from "./leastCommonMultiple";

describe("leastCommonMultiple", () => {
  it("returns the least common multiple of two positive integers", () => {
    const left = createPositiveInteger(6n);
    const right = createPositiveInteger(15n);

    expect(leastCommonMultiple(left, right)).toBe(30n);
  });

  it("returns the product for coprime positive integers", () => {
    const left = createPositiveInteger(7n);
    const right = createPositiveInteger(5n);

    expect(leastCommonMultiple(left, right)).toBe(35n);
  });

  it("returns the same value for identical positive integers", () => {
    const value = createPositiveInteger(12n);

    expect(leastCommonMultiple(value, value)).toBe(12n);
  });

  it("handles large bigint values exactly", () => {
    const left = createPositiveInteger(9_007_199_254_740_993n);
    const right = createPositiveInteger(2n);

    expect(leastCommonMultiple(left, right)).toBe(18_014_398_509_481_986n);
  });
});
