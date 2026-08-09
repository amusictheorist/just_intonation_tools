import { describe, expect, it } from "vitest";
import { createPartialClassSet } from "./partialClassSet";
import { createPartialClass } from "./partialClass";

describe("createPartialClassSet", () => {
  it("constructs a partial-class set from validated partial classes", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(partialClassSet.members).toEqual([1n, 3n, 5n]);
  });

  it("removes duplicate partial classes", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(partialClassSet.members).toEqual([1n, 3n, 5n]);
  });

  it("exposes members in ascending order", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(5n),
      createPartialClass(1n),
      createPartialClass(3n),
    ]);

    expect(partialClassSet.members).toEqual([1n, 3n, 5n]);
  });

  it("rejects an empty collection", () => {
    expect(() => createPartialClassSet([])).toThrow(
      "A partial-class set cannot be empty",
    );
  });

  it("is not changed when the input array is mutated", () => {
    const members = [
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ];

    const partialClassSet = createPartialClassSet(members);

    members.push(createPartialClass(7n));

    expect(partialClassSet.members).toEqual([1n, 3n, 5n]);
  });

  it("exposes an immutable members array", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    expect(Object.isFrozen(partialClassSet.members)).toBe(true);
  });
});
