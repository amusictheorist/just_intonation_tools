import { describe, expect, it } from "vitest";
import { createPositiveInteger } from "./positiveInteger";
import { createRatio } from "./ratio";
import { areRatiosEqual } from "./areRatiosEqual";

describe("areRatiosequal", () => {
  it("returns true for equal ratios", () => {
    const left = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );

    const right = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );

    expect(areRatiosEqual(left, right)).toBe(true);
  });

  it("returns true for equivalent ratios", () => {
    const left = createRatio(
      createPositiveInteger(6n),
      createPositiveInteger(4n),
    );

    const right = createRatio(
      createPositiveInteger(15n),
      createPositiveInteger(10n),
    );

    expect(areRatiosEqual(left, right)).toBe(true);
  });

  it("returns false for different ratios", () => {
    const left = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );

    const right = createRatio(
      createPositiveInteger(5n),
      createPositiveInteger(4n),
    );

    expect(areRatiosEqual(left, right)).toBe(false);
  });

  it("returns false when only the numerator differs", () => {
    const left = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );

    const right = createRatio(
      createPositiveInteger(5n),
      createPositiveInteger(2n),
    );

    expect(areRatiosEqual(left, right)).toBe(false);
  });

  it("returns false when only the denominator differs", () => {
    const left = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(2n),
    );

    const right = createRatio(
      createPositiveInteger(3n),
      createPositiveInteger(4n),
    );

    expect(areRatiosEqual(left, right)).toBe(false);
  });
});
