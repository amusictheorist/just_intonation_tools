import { describe, expect, it } from "vitest";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";
import { createPartialClass } from "./partialClass";
import { createPartialClassSet } from "./partialClassSet";
import { createPositiveInteger } from "./positiveInteger";
import { transposePartialClassSet } from "./transposePartialClassSet";

function assertPartialClassFactorContract() {
  const partialClassSet = createPartialClassSet([
    createPartialClass(1n),
    createPartialClass(3n),
    createPartialClass(5n),
  ]);

  const positiveInteger = createPositiveInteger(2n);

  // @ts-expect-error A generic positive integer is not a validated odd factor.
  transposePartialClassSet(partialClassSet, positiveInteger);
}

// Mark the compile-time contract helper as intentionally used without
// executing its invalid runtime call.
void assertPartialClassFactorContract;

describe("transposePartialClassSet", () => {
  it("transposes every member by a positive odd integer factor", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const factor = createPartialClass(3n);

    expect(transposePartialClassSet(partialClassSet, factor).members).toEqual([
      3n,
      9n,
      15n,
    ]);
  });

  it("returns an equivalent set when transposed by 1", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const factor = createPartialClass(1n);

    expect(transposePartialClassSet(partialClassSet, factor)).toEqual(
      partialClassSet,
    );
  });

  it("preserves cardinality", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const factor = createPartialClass(7n);

    expect(
      transposePartialClassSet(partialClassSet, factor).members,
    ).toHaveLength(partialClassSet.members.length);
  });

  it("preserves partial-class-set class membership", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const factor = createPartialClass(7n);
    const transposed = transposePartialClassSet(partialClassSet, factor);

    expect(arePartialClassSetsEquivalent(partialClassSet, transposed)).toBe(
      true,
    );
  });

  it("transposes large bigint members exactly", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(9_007_199_254_740_993n),
    ]);

    const factor = createPartialClass(3n);

    expect(transposePartialClassSet(partialClassSet, factor).members).toEqual([
      27_021_597_764_222_979n,
    ]);
  });
});
