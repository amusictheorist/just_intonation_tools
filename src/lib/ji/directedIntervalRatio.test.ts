import { describe, expect, it } from "vitest";
import { createPartial } from "./partial";
import { directedIntervalRatio } from "./directedIntervalRatio";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";

describe("directedIntervalRatio", () => {
  it("returns the directed interval from source to target", () => {
    const source = createPartial(3n);
    const target = createPartial(5n);

    expect(directedIntervalRatio(source, target)).toEqual(
      createRatio(createPositiveInteger(5n), createPositiveInteger(3n)),
    );
  });

  it("preserves descending direction", () => {
    const source = createPartial(5n);
    const target = createPartial(3n);

    expect(directedIntervalRatio(source, target)).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(5n)),
    );
  });

  it("returns unison for identical source and target partials", () => {
    const partial = createPartial(7n);

    expect(directedIntervalRatio(partial, partial)).toEqual(
      createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
    );
  });

  it("returns the interval ratio in canonical form", () => {
    const source = createPartial(6n);
    const target = createPartial(9n);

    expect(directedIntervalRatio(source, target)).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(2n)),
    );
  });

  it("handles large bigint partials exactly", () => {
    const source = createPartial(9_007_199_254_740_993n);
    const target = createPartial(18_014_398_509_481_986n);

    expect(directedIntervalRatio(source, target)).toEqual(
      createRatio(createPositiveInteger(2n), createPositiveInteger(1n)),
    );
  });
});
