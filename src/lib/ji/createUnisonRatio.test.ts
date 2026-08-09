import { describe, expect, it } from "vitest";
import { createUnisonRatio } from "./createUnisonRatio";

describe("createUnisonRatio", () => {
  it("returns the canonical unsion ratio", () => {
    expect(createUnisonRatio()).toEqual({
      numerator: 1n,
      denominator: 1n,
    });
  });
});
