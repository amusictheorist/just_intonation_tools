import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";
import { partialClassSetIntervalMatrix } from "./partialClassSetIntervalMatrix";
import { createRatio } from "./ratio";

describe("partialClassSetIntervalMatrix", () => {
  it("returns directed interval ratios for every ordered member pair", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(partialClassSetIntervalMatrix(partialClassSet)).toEqual([
      [
        createRatio(createPartialClass(1n), createPartialClass(1n)),
        createRatio(createPartialClass(5n), createPartialClass(3n)),
      ],
      [
        createRatio(createPartialClass(3n), createPartialClass(5n)),
        createRatio(createPartialClass(1n), createPartialClass(1n)),
      ],
    ]);
  });

  it("uses deterministic member ordering for rows and columns", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(7n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(partialClassSetIntervalMatrix(partialClassSet)).toEqual([
      [
        createRatio(createPartialClass(1n), createPartialClass(1n)),
        createRatio(createPartialClass(5n), createPartialClass(3n)),
        createRatio(createPartialClass(7n), createPartialClass(3n)),
      ],
      [
        createRatio(createPartialClass(3n), createPartialClass(5n)),
        createRatio(createPartialClass(1n), createPartialClass(1n)),
        createRatio(createPartialClass(7n), createPartialClass(5n)),
      ],
      [
        createRatio(createPartialClass(3n), createPartialClass(7n)),
        createRatio(createPartialClass(5n), createPartialClass(7n)),
        createRatio(createPartialClass(1n), createPartialClass(1n)),
      ],
    ]);
  });

  it("returns a 1-by-1 unison matrix for a singleton partial-class set", () => {
    const partialClassSet = createPartialClassSet([createPartialClass(7n)]);

    expect(partialClassSetIntervalMatrix(partialClassSet)).toEqual([
      [createRatio(createPartialClass(1n), createPartialClass(1n))],
    ]);
  });

  it("does not mutate the input partial-class set", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(5n),
      createPartialClass(7n),
    ]);

    partialClassSetIntervalMatrix(partialClassSet);

    expect(partialClassSet.members).toEqual([3n, 5n, 7n]);
  });
});
