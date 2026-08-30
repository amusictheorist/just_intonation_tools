import { describe, expect, it } from "vitest";
import { createPartialSet } from "../ji/set/partialSet";
import { createPartial } from "../ji/partial/partial";
import { buildCalculatorResult } from "./buildCalculatorResult";

describe("buildCalculatorResult", () => {
  it("builds the partial and partial-class sets", () => {
    const partialSet = createPartialSet([
      createPartial(60n),
      createPartial(75n),
      createPartial(90n),
    ]);

    const result = buildCalculatorResult(partialSet);

    expect(result.partial.set.members).toEqual([60n, 75n, 90n]);
    expect(result.partialClass.set.members).toEqual([15n, 45n, 75n]);
    expect(result.partial.setClass.members).toEqual([4n, 5n, 6n]);
    expect(result.partialClass.setClass.members).toEqual([1n, 3n, 5n]);
    expect(result.partial.lowInverse.members).toEqual([10n, 12n, 15n]);
    expect(result.partialClass.lowInverse.members).toEqual([3n, 5n, 15n]);
    expect(result.partial.lowInverseSetClass.members).toEqual([10n, 12n, 15n]);
    expect(result.partialClass.lowInverseSetClass.members).toEqual([
      3n,
      5n,
      15n,
    ]);
  });
});
