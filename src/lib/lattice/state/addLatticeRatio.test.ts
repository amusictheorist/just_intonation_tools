import { describe, expect, it } from "vitest";
import { createLatticeRatio } from "./createLatticeRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { addLatticeRatio } from "./addLatticeRatio";

describe("addLatticeRatio", () => {
  it("adds a new lattice ratio to the end of the collection", () => {
    const first = createLatticeRatio("ratio-1", "3/2", createTestRatio(3n, 2n));
    const second = createLatticeRatio(
      "ratio-2",
      "5/4",
      createTestRatio(5n, 4n),
    );
    expect(addLatticeRatio([first], second)).toEqual({
      status: "added",
      ratios: [first, second],
    });
  });

  it("returns the existing lattice ratio when a canonical duplicate is added", () => {
    const existing = createLatticeRatio(
      "ratio-1",
      "3/2",
      createTestRatio(3n, 2n),
    );
    const duplicate = createLatticeRatio(
      "ratio-2",
      "6/4",
      createTestRatio(6n, 4n),
    );

    expect(addLatticeRatio([existing], duplicate)).toEqual({
      status: "duplicate",
      ratios: [existing],
      existingRatio: existing,
    });
  });

  it("accepts exact distinct ratios that may share an octave-normalized placement", () => {
    const upper = createLatticeRatio("ratio-1", "3/2", createTestRatio(3n, 2n));
    const lower = createLatticeRatio("ratio-2", "3/4", createTestRatio(3n, 4n));

    expect(addLatticeRatio([upper], lower)).toEqual({
      status: "added",
      ratios: [upper, lower],
    });
  });
});
