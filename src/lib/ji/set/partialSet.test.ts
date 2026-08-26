import { describe, expect, it } from "vitest";
import { createPartialSet } from "./partialSet";
import { createPartial } from "../partial/partial";

describe("createPartialSet", () => {
  it("constructs a partial set from validated partials", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    expect(partialSet.members).toEqual([3n, 4n, 5n]);
  });

  it("removes duplicate partials", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(4n),
      createPartial(5n),
    ]);

    expect(partialSet.members).toEqual([3n, 4n, 5n]);
  });

  it("exposes members in ascending order", () => {
    const partialSet = createPartialSet([
      createPartial(5n),
      createPartial(3n),
      createPartial(4n),
    ]);

    expect(partialSet.members).toEqual([3n, 4n, 5n]);
  });

  it("rejects an empty collection", () => {
    expect(() => createPartialSet([])).toThrow("A partial set cannot be empty");
  });

  it("is not changed when the input array is mutated", () => {
    const members = [createPartial(3n), createPartial(4n), createPartial(5n)];

    const partialSet = createPartialSet(members);

    members.push(createPartial(7n));

    expect(partialSet.members).toEqual([3n, 4n, 5n]);
  });

  it("exposes an immutable members array", () => {
    const partialSet = createPartialSet([
      createPartial(3n),
      createPartial(4n),
      createPartial(5n),
    ]);

    expect(Object.isFrozen(partialSet.members)).toBe(true);
  });
});
