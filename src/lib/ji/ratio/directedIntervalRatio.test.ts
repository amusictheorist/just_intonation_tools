import { describe, expect, it } from "vitest";
import { createPartial } from "../partial/partial";
import { directedIntervalRatio } from "./directedIntervalRatio";
import { createRatio } from "./ratio";
import { createPartialClass } from "../partial/partialClass";
import { createPositiveInteger } from "../integer/positiveInteger";

describe("directedIntervalRatio", () => {
  it("returns the directed interval from source to target", () => {
    const partialSource = createPartial(3n);
    const partialTarget = createPartial(5n);
    const partialClassSource = createPartialClass(3n);
    const partialClassTarget = createPartialClass(5n);

    expect(directedIntervalRatio(partialSource, partialTarget)).toEqual(
      createRatio(createPositiveInteger(5n), createPositiveInteger(3n)),
    );

    expect(
      directedIntervalRatio(partialClassSource, partialClassTarget),
    ).toEqual(
      createRatio(createPositiveInteger(5n), createPositiveInteger(3n)),
    );
  });

  it("preserves descending direction", () => {
    const partialSource = createPartial(5n);
    const partialTarget = createPartial(3n);
    const partialClassSource = createPartialClass(5n);
    const partialClassTarget = createPartialClass(3n);

    expect(directedIntervalRatio(partialSource, partialTarget)).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(5n)),
    );

    expect(
      directedIntervalRatio(partialClassSource, partialClassTarget),
    ).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(5n)),
    );
  });

  it("returns unison for identical source and target partials and partial classes", () => {
    const partial = createPartial(8n);
    const partialClass = createPartialClass(7n);

    expect(directedIntervalRatio(partial, partial)).toEqual(
      createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
    );

    expect(directedIntervalRatio(partialClass, partialClass)).toEqual(
      createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
    );
  });

  it("returns the interval ratio in canonical form", () => {
    const partialSource = createPartial(6n);
    const partialTarget = createPartial(9n);
    const partialClassSource = createPartialClass(5n);
    const partialClassTarget = createPartialClass(15n);

    expect(directedIntervalRatio(partialSource, partialTarget)).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(2n)),
    );

    expect(
      directedIntervalRatio(partialClassSource, partialClassTarget),
    ).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(1n)),
    );
  });

  it("handles large bigint partials and partial classes exactly", () => {
    const partialSource = createPartial(9_007_199_254_740_993n);
    const partialTarget = createPartial(18_014_398_509_481_986n);
    const partialClassSource = createPartialClass(9_007_199_254_740_993n);
    const partialClassTarget = createPartialClass(27_021_597_764_222_979n);

    expect(directedIntervalRatio(partialSource, partialTarget)).toEqual(
      createRatio(createPositiveInteger(2n), createPositiveInteger(1n)),
    );

    expect(
      directedIntervalRatio(partialClassSource, partialClassTarget),
    ).toEqual(
      createRatio(createPositiveInteger(3n), createPositiveInteger(1n)),
    );
  });

  it("does not allow partials and partial classes to be mixed", () => {
    const partial = createPartial(3n);
    const partialClass = createPartialClass(5n);

    // @ts-expect-error Mixed Partial and PartialClass inputs are not permitted.
    directedIntervalRatio(partial, partialClass);

    // @ts-expect-error Mixed PartialClass and Partial inputs are not permitted.
    directedIntervalRatio(partialClass, partial);
  });
});
