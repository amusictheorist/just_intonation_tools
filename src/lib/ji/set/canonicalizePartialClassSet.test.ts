import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "../partial/partialClass";
import { canonicalizePartialClassSet } from "./canonicalizePartialClassSet";

describe("canonicalizePartialClassSet", () => {
  it("preserves an already canonical partial-class set", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(canonicalizePartialClassSet(partialClassSet)).toEqual(
      partialClassSet,
    );
  });

  it("reduces a scaled partial-class set to its canonical representative", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(9n),
      createPartialClass(15n),
    ]);

    expect(canonicalizePartialClassSet(partialClassSet).members).toEqual([
      1n,
      3n,
      5n,
    ]);
  });

  it("canonicalzes a singleton partial-class set to 1n", () => {
    const partialClassSet = createPartialClassSet([createPartialClass(9n)]);

    expect(canonicalizePartialClassSet(partialClassSet).members).toEqual([1n]);
  });

  it("does not mutate the input partial-class set", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(9n),
      createPartialClass(15n),
    ]);

    canonicalizePartialClassSet(partialClassSet);

    expect(partialClassSet.members).toEqual([3n, 9n, 15n]);
  });
});
