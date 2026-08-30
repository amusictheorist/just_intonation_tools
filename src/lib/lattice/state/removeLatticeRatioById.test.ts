import { describe, expect, it } from "vitest";
import { createLatticeRatio } from "./createLatticeRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { removeLatticeRatioById } from "./removeLatticeRatioById";

describe("removeLatticeRatioById", () => {
  it("removes the lattice ratio with the matching id", () => {
    const first = createLatticeRatio("ratio-1", "3/2", createTestRatio(3n, 2n));
    const second = createLatticeRatio(
      "ratio-2",
      "5/4",
      createTestRatio(5n, 4n),
    );

    expect(removeLatticeRatioById([first, second], "ratio-1")).toEqual([
      second,
    ]);
  });

  it("leaves the collection unchanged when no id matches", () => {
    const first = createLatticeRatio("ratio-1", "3/2", createTestRatio(3n, 2n));

    expect(removeLatticeRatioById([first], "ratio-2")).toEqual([first]);
  });
});
