import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { canonicalPartialClassSetSum } from "./canonicalPartialClassSetSum";

describe("canonicalPartialClassSetSum", () => {
  it("calculates Parcspace Spectral Extension from the canonical representative", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(9n),
      createPartialClass(15n),
    ]);

    expect(canonicalPartialClassSetSum(partialClassSet)).toBe(9n);
  });

  it("returns the same value for equivalent partial-class sets", () => {
    const first = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(5n),
      createPartialClass(7n),
    ]);

    const second = createPartialClassSet([
      createPartialClass(9n),
      createPartialClass(15n),
      createPartialClass(21n),
    ]);

    expect(canonicalPartialClassSetSum(first)).toBe(15n);
    expect(canonicalPartialClassSetSum(second)).toBe(15n);
  });

  it("sums a nontrivial canonical representative", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(5n),
      createPartialClass(15n),
      createPartialClass(25n),
    ]);

    expect(canonicalPartialClassSetSum(partialClassSet)).toBe(9n);
  });

  it("return 1n for every singleton partial-class-set class", () => {
    const partialSet = createPartialClassSet([createPartialClass(17n)]);

    expect(canonicalPartialClassSetSum(partialSet)).toBe(1n);
  });
});
