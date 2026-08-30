import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "../set/partialClassSet";
import { createPartialClass } from "../partial/partialClass";
import { cardinalityScaledPartialClassSetSum } from "./cardinalityScaledPartialClassSetSum";
import { createRatio } from "../ratio/ratio";
import { createPositiveInteger } from "../integer/positiveInteger";

describe("cardinalityScaledPartialClassSetSum", () => {
  it("returns 1 for the simplest cardinality-three partial-class-set class", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(cardinalityScaledPartialClassSetSum(partialClassSet)).toEqual(
      createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
    );
  });

  it("returns the exact scaled value for a nontrivial partial-class-set class", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(5n),
      createPartialClass(7n),
    ]);

    expect(cardinalityScaledPartialClassSetSum(partialClassSet)).toEqual(
      createRatio(createPositiveInteger(5n), createPositiveInteger(3n)),
    );
  });

  it("returns the same scaled value for equivalent partial-class sets", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(9n),
      createPartialClass(15n),
      createPartialClass(21n),
    ]);

    expect(cardinalityScaledPartialClassSetSum(partialClassSet)).toEqual(
      createRatio(createPositiveInteger(5n), createPositiveInteger(3n)),
    );
  });
});
