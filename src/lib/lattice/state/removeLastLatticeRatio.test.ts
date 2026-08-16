import { describe, expect, it } from "vitest";
import { createLatticeRatio } from "./createLatticeRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { removeLastLatticeRatio } from "./removeLastLatticeRatio";

describe("removeLastLatticeRatio", () => {
  it("removes the most recently added lattice ratio", () => {
    const first = createLatticeRatio("ratio-1", "3/2", createTestRatio(3n, 2n));
    const second = createLatticeRatio(
      "ratio-2",
      "5/4",
      createTestRatio(5n, 4n),
    );

    expect(removeLastLatticeRatio([first, second])).toEqual([first]);
  });

  it("leaves an empty lattice ratio collection unchanged", () => {
    expect(removeLastLatticeRatio([])).toEqual([]);
  });
});
