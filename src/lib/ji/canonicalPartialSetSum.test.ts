import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { canonicalPartialSetSum } from "./canonicalPartialSetSum";

describe("canonicalPartialSetSum", () => {
  it("calculates Parspace Spectral Extension from the canonical representative", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(8n),
      createPartial(12n),
    ]);

    expect(canonicalPartialSetSum(partialSet)).toBe(6n);
  });

  it("returns the same value for equivalent partial sets", () => {
    const first = createPartialSet([
      createPartial(1n),
      createPartial(2n),
      createPartial(3n),
    ]);

    const second = createPartialSet([
      createPartial(3n),
      createPartial(6n),
      createPartial(9n),
    ]);

    expect(canonicalPartialSetSum(first)).toBe(6n);
    expect(canonicalPartialSetSum(second)).toBe(6n);
  });

  it("sums a nontrivial canonical representative", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(6n),
      createPartial(10n),
    ]);

    expect(canonicalPartialSetSum(partialSet)).toBe(10n);
  });

  it("return 1n for every singleton partial-set class", () => {
    const partialSet = createPartialSet([createPartial(17n)]);

    expect(canonicalPartialSetSum(partialSet)).toBe(1n);
  });
});
