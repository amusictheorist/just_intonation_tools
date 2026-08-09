import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { lowInvertPartialSet } from "./lowInvertPartialSet";

describe("lowInvertPartialSet", () => {
  it("returns the low inverse of a partial set", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(5n),
      createPartial(6n),
    ]);

    expect(lowInvertPartialSet(partialSet).members).toEqual([10n, 12n, 15n]);
  });

  it("returns 1n for a singleton partial set", () => {
    const partialSet = createPartialSet([createPartial(4n)]);

    expect(lowInvertPartialSet(partialSet).members).toEqual([1n]);
  });

  it("does not mutate the input partial set", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(5n),
      createPartial(6n),
    ]);

    lowInvertPartialSet(partialSet);

    expect(partialSet.members).toEqual([4n, 5n, 6n]);
  });
});
