import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { partialSetIntervalMatrix } from "./partialSetIntervalMatrix";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";
import { createPartial } from "./partial";

describe("partialSetIntervalMatrix", () => {
  it("returns directed interval ratios for every ordered member pair", () => {
    const partialSet = createPartialSet([createPartial(2n), createPartial(3n)]);

    expect(partialSetIntervalMatrix(partialSet)).toEqual([
      [
        createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
        createRatio(createPositiveInteger(3n), createPositiveInteger(2n)),
      ],
      [
        createRatio(createPositiveInteger(2n), createPositiveInteger(3n)),
        createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
      ],
    ]);
  });

  it("uses deterministic member ordering for rows and columns", () => {
    const partialSet = createPartialSet([
      createPartial(5n),
      createPartial(2n),
      createPartial(3n),
    ]);

    expect(partialSetIntervalMatrix(partialSet)).toEqual([
      [
        createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
        createRatio(createPositiveInteger(3n), createPositiveInteger(2n)),
        createRatio(createPositiveInteger(5n), createPositiveInteger(2n)),
      ],
      [
        createRatio(createPositiveInteger(2n), createPositiveInteger(3n)),
        createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
        createRatio(createPositiveInteger(5n), createPositiveInteger(3n)),
      ],
      [
        createRatio(createPositiveInteger(2n), createPositiveInteger(5n)),
        createRatio(createPositiveInteger(3n), createPositiveInteger(5n)),
        createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
      ],
    ]);
  });

  it("returns a 1-by-1 unsion matrix for a singleton partial set", () => {
    const partialSet = createPartialSet([createPartial(7n)]);

    expect(partialSetIntervalMatrix(partialSet)).toEqual([
      [createRatio(createPositiveInteger(1n), createPositiveInteger(1n))],
    ]);
  });

  it("does not mutate the input partial set", () => {
    const partialSet = createPartialSet([
      createPartial(5n),
      createPartial(2n),
      createPartial(3n),
    ]);

    partialSetIntervalMatrix(partialSet);

    expect(partialSet.members).toEqual([2n, 3n, 5n]);
  });
});
