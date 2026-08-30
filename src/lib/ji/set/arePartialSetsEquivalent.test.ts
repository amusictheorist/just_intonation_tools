import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "../partial/partial";
import { arePartialSetsEquivalent } from "./arePartialSetsEquivalent";

describe("arePartialSetsEquivalent", () => {
  it("treats equal literal partial sets as class-equivalent", () => {
    const left = createPartialSet([
      createPartial(1n),
      createPartial(2n),
      createPartial(3n),
    ]);

    const right = createPartialSet([
      createPartial(1n),
      createPartial(2n),
      createPartial(3n),
    ]);

    expect(arePartialSetsEquivalent(left, right)).toBe(true);
  });

  it("treats partial sets from different classes as not equivalent", () => {
    const left = createPartialSet([
      createPartial(1n),
      createPartial(2n),
      createPartial(3n),
    ]);

    const right = createPartialSet([
      createPartial(1n),
      createPartial(3n),
      createPartial(5n),
    ]);

    expect(arePartialSetsEquivalent(left, right)).toBe(false);
  });

  it("treats differently scaled representatives as equivalent", () => {
    const left = createPartialSet([
      createPartial(1n),
      createPartial(2n),
      createPartial(3n),
    ]);

    const right = createPartialSet([
      createPartial(2n),
      createPartial(4n),
      createPartial(6n),
    ]);

    expect(arePartialSetsEquivalent(left, right)).toBe(true);
  });

  it("treats singleton partial sets as equivalent", () => {
    const left = createPartialSet([createPartial(3n)]);
    const right = createPartialSet([createPartial(11n)]);

    expect(arePartialSetsEquivalent(left, right)).toBe(true);
  });
});
