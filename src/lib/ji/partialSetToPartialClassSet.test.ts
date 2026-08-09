import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { partialSetToPartialClassSet } from "./partialSetToPartialClassSet";

describe("partialSetToPartialClassSet", () => {
  it("converts every partial to its partial class", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    expect(partialSetToPartialClassSet(partialSet).members).toEqual([
      1n,
      3n,
      5n,
    ]);
  });

  it("collapses octave-equivalent partials to one partial class", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(6n),
      createPartial(12n),
    ]);

    expect(partialSetToPartialClassSet(partialSet).members).toEqual([3n]);
  });

  it("does not mutate the input partial set", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(6n),
      createPartial(12n),
    ]);

    partialSetToPartialClassSet(partialSet);

    expect(partialSet.members).toEqual([3n, 6n, 12n]);
  });
});
