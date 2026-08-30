import { describe, expect, it } from "vitest";
import { createPartialSet } from "../ji/set/partialSet";
import { createPartial } from "../ji/partial/partial";
import { transposeCalculatorResult } from "./transposeCalculatorResult";
import { createPositiveInteger } from "../ji/integer/positiveInteger";

describe("transposeCalculatorResult", () => {
  it("returns a complete calculator result for the transposed partial set", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(5n),
      createPartial(6n),
    ]);

    const transpositionFactor = createPositiveInteger(3n);

    const result = transposeCalculatorResult(partialSet, transpositionFactor);

    expect(result.partialSet.members).toEqual([12n, 15n, 18n]);
    expect(result.partialClassSet.members).toEqual([3n, 9n, 15n]);
  });
});
