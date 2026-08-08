import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { createPositiveInteger } from "./positiveInteger";
import { transposePartialSet } from "./transposePartialSet";
import { arePartialSetsEquivalent } from "./arePartialSetsEquivalent";

describe("transposePartialSet", () => {
  it("transposes every member by a positive integer factor", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    const factor = createPositiveInteger(2n);

    expect(transposePartialSet(partialSet, factor).members).toEqual([
      6n,
      8n,
      10n,
    ]);
  });

  it("returns an equivalent set when transposed by 1", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    const factor = createPositiveInteger(1n);

    expect(transposePartialSet(partialSet, factor)).toEqual(partialSet);
  });

  it("preserves cardinality", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    const factor = createPositiveInteger(7n);

    expect(transposePartialSet(partialSet, factor).members).toHaveLength(
      partialSet.members.length,
    );
  });

  it("preserves partial-set class membership", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    const factor = createPositiveInteger(7n);
    const transposed = transposePartialSet(partialSet, factor);

    expect(arePartialSetsEquivalent(partialSet, transposed)).toBe(true);
  });

  it("transposes large bigint members exactly", () => {
    const partialSet = createPartialSet([
      createPartial(9_007_199_254_740_993n),
    ]);

    const factor = createPositiveInteger(3n);

    expect(transposePartialSet(partialSet, factor).members).toEqual([
      27_021_597_764_222_979n,
    ]);
  });
});
