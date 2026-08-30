import { describe, expect, it } from "vitest";
import { partialToPartialClass } from "./partialToPartialClass";
import { createPartial } from "./partial";

describe("partialToPartialClass", () => {
  it("maps an odd partial to itself", () => {
    expect(partialToPartialClass(createPartial(7n))).toBe(7n);
  });

  it("maps 2n to 1n", () => {
    expect(partialToPartialClass(createPartial(2n))).toBe(1n);
  });

  it("removes repeated factors of 2n", () => {
    expect(partialToPartialClass(createPartial(8n))).toBe(1n);
  });

  it("preserves the odd component after removing powers of 2n", () => {
    expect(partialToPartialClass(createPartial(24n))).toBe(3n);
  });
});
