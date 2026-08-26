import { describe, expect, it } from "vitest";
import { createPartialClass } from "./partialClass";

describe("createPartialClass", () => {
  it("accepts a positive bigint", () => {
    expect(createPartialClass(1n)).toBe(1n);
  });

  it("rejects an even positive bigint", () => {
    expect(() => createPartialClass(2n)).toThrow(
      "Expected an odd positive bigint",
    );
  });

  it("rejects zero", () => {
    expect(() => createPartialClass(0n)).toThrow("Expected a positive bigint");
  });

  it("rejects a negative bigint", () => {
    expect(() => createPartialClass(-1n)).toThrow("Expected a positive bigint");
  });

  it("rejects non-bigint values at runtime", () => {
    expect(() => createPartialClass(1 as unknown as bigint)).toThrow(
      "Expected a positive bigint",
    );
  });

  it("accepts another positive odd bigint", () => {
    expect(createPartialClass(7n)).toBe(7n);
  });
});
