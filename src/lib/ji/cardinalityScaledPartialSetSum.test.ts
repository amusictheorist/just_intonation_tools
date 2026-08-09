import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "./partial";
import { cardinalityScaledPartialSetSum } from "./cardinalityScaledPartialSetSum";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";

describe("cardinalityScaledPartialSetSum", () => {
  it("returns 1 for the simplest cardinality-three partial-set class", () => {
    const partialSet = createPartialSet([
      createPartial(1n),
      createPartial(2n),
      createPartial(3n),
    ]);

    expect(cardinalityScaledPartialSetSum(partialSet)).toEqual(
      createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
    );
  });

  it("returns the exact scaled value for a nontrivial partial-set class", () => {
    const partialSet = createPartialSet([
      createPartial(1n),
      createPartial(3n),
      createPartial(5n),
    ]);

    expect(cardinalityScaledPartialSetSum(partialSet)).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(2n)),
    );
  });

  it("returns the same scaled value for equivalent partial sets", () => {
    const partialSet = createPartialSet([
      createPartial(2n),
      createPartial(6n),
      createPartial(10n),
    ]);

    expect(cardinalityScaledPartialSetSum(partialSet)).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(2n)),
    );
  });
});
