import { describe, expect, it } from "vitest";
import { createPartial } from "./partial";

describe("createPartial", () => {
  it("accepts a positive bigint", () => {
    expect(createPartial(1n)).toBe(1n);
  });

  it("rejects zero", () => {
    expect(() => createPartial(0n)).toThrow("Expected a positive bigint");
  });

  it("rejects a negative bigint", () => {
    expect(() => createPartial(-1n)).toThrow("Expected a positive bigint");
  });

  it("rejects non-bigint values at runtime", () => {
    expect(() => createPartial(1 as unknown as bigint)).toThrow(
      "Expected a positive bigint",
    );
  });
});
