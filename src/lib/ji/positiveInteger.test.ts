import { describe, expect, it } from "vitest";
import { createPositiveInteger } from "./positiveInteger";

describe("createPositiveInteger", () => {
  it("accepts a bigint greater than zero", () => {
    expect(createPositiveInteger(1n)).toBe(1n);
  });

  it("rejects zero", () => {
    expect(() => createPositiveInteger(0n)).toThrow();
  });

  it("rejects a negative bigint", () => {
    expect(() => createPositiveInteger(-1n)).toThrow();
  });

  it("rejects number values at runtime", () => {
    expect(() => createPositiveInteger(1 as unknown as bigint)).toThrow();
  });
});
