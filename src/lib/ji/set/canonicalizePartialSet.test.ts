import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "../partial/partial";
import { canonicalizePartialSet } from "./canonicalizePartialSet";

describe("canonicalizePartialSet", () => {
  it("preserves an already canonical partial set", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    expect(canonicalizePartialSet(partialSet)).toEqual(partialSet);
  });

  it("reduces a scaled partial set to its canonical representative", () => {
    const partialSet = createPartialSet([
      createPartial(2n),
      createPartial(4n),
      createPartial(6n),
    ]);

    expect(canonicalizePartialSet(partialSet).members).toEqual([1n, 2n, 3n]);
  });

  it("reduces by the greatest common divisor", () => {
    const partialSet = createPartialSet([
      createPartial(6n),
      createPartial(9n),
      createPartial(15n),
    ]);

    expect(canonicalizePartialSet(partialSet).members).toEqual([2n, 3n, 5n]);
  });

  it("canonicalizes a singleton partial set to 1n", () => {
    const partialSet = createPartialSet([createPartial(7n)]);

    expect(canonicalizePartialSet(partialSet).members).toEqual([1n]);
  });

  it("does not mutate the input partial set", () => {
    const partialSet = createPartialSet([
      createPartial(6n),
      createPartial(9n),
      createPartial(15n),
    ]);

    canonicalizePartialSet(partialSet);

    expect(partialSet.members).toEqual([6n, 9n, 15n]);
  });
});
