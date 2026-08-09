import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { lowInvertPartialClassSet } from "./lowInvertPartialClassSet";

describe("lowInvertPartialClassSet", () => {
  it("returns the low inverse of a partial class set", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(lowInvertPartialClassSet(partialClassSet).members).toEqual([
      3n,
      5n,
      15n,
    ]);
  });

  it("returns 1n for a singleton partial-class set", () => {
    const partialClassSet = createPartialClassSet([createPartialClass(7n)]);

    expect(lowInvertPartialClassSet(partialClassSet).members).toEqual([1n]);
  });

  it("does not mutate the input partial-class set", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    lowInvertPartialClassSet(partialClassSet);

    expect(partialClassSet.members).toEqual([1n, 3n, 5n]);
  });
});
