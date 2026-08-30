import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "../partial/partialClass";
import { arePartialClassSetsEquivalent } from "./arePartialClassSetsEquivalent";

describe("arePartialClassSetsEquivalent", () => {
  it("treats equal literal partial-class sets as equivalent", () => {
    const left = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const right = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(arePartialClassSetsEquivalent(left, right)).toBe(true);
  });

  it("treats partial-class sets from different classes as not equivalent", () => {
    const left = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const right = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(7n),
    ]);

    expect(arePartialClassSetsEquivalent(left, right)).toBe(false);
  });

  it("treats differently scaled partial-class sets as equivalent", () => {
    const left = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const right = createPartialClassSet([
      createPartialClass(3n),
      createPartialClass(9n),
      createPartialClass(15n),
    ]);

    expect(arePartialClassSetsEquivalent(left, right)).toBe(true);
  });

  it("treats singleton partial-class sets as equivalent", () => {
    const left = createPartialClassSet([createPartialClass(3n)]);
    const right = createPartialClassSet([createPartialClass(11n)]);

    expect(arePartialClassSetsEquivalent(left, right)).toBe(true);
  });
});
