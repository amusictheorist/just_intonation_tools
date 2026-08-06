import { describe, expect, it } from "vitest";
import { createPositiveInteger } from "./positiveInteger";
import { createRatio } from "./ratio";

describe("createRatio", () => {
  it("reduces a ratio to canonical form", () => {
    expect(
      createRatio(createPositiveInteger(6n), createPositiveInteger(4n)),
    ).toEqual({ numerator: 3n, denominator: 2n });
  });

  it("preserves a ratio already in canonical form", () => {
    expect(
      createRatio(createPositiveInteger(7n), createPositiveInteger(5n)),
    ).toEqual({ numerator: 7n, denominator: 5n });
  });

  it("gives equivalent ratios the same canonical representation", () => {
    expect(
      createRatio(createPositiveInteger(15n), createPositiveInteger(10n)),
    ).toEqual(
      createRatio(createPositiveInteger(6n), createPositiveInteger(4n)),
    );
  });

  it("reduces equal terms to unison", () => {
    expect(
      createRatio(createPositiveInteger(6n), createPositiveInteger(6n)),
    ).toEqual({ numerator: 1n, denominator: 1n });
  });

  it("reduces values beyond JavaScript's safe-integer range exactly", () => {
    expect(
      createRatio(
        createPositiveInteger(18_014_398_509_481_984n),
        createPositiveInteger(27_021_597_764_222_976n),
      ),
    ).toEqual({ numerator: 2n, denominator: 3n });
  });

  it("returns a ratio that is immutable at runtime", () => {
    const ratio = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );

    expect(Object.isFrozen(ratio)).toBe(true);
  });
});
