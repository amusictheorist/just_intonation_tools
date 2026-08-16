import { describe, expect, it } from "vitest";
import { addLatticeRatioFromInput } from "./addLatticeRatioFromInput";
import { createLatticeRatio } from "./createLatticeRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("addLatticeRatioFromInput", () => {
  it("adds valid ratio input to the collection", () => {
    const latticeRatio = createLatticeRatio(
      "ratio-1",
      "3/2",
      createTestRatio(3n, 2n),
    );

    expect(addLatticeRatioFromInput([], "ratio-1", "3/2")).toEqual({
      status: "added",
      ratios: [latticeRatio],
    });
  });

  it("returns the existing ratio when valid input is already present", () => {
    const existing = createLatticeRatio(
      "ratio-1",
      "3/2",
      createTestRatio(3n, 2n),
    );

    expect(addLatticeRatioFromInput([existing], "ratio-2", "6/4")).toEqual({
      status: "duplicate",
      ratios: [existing],
      existingRatio: existing,
    });
  });

  it("preserves the collection and returns the parser error for invalid input", () => {
    const existing = createLatticeRatio(
      "ratio-1",
      "3/2",
      createTestRatio(3n, 2n),
    );

    expect(addLatticeRatioFromInput([existing], "ratio-2", "3/0")).toEqual({
      status: "invalid",
      ratios: [existing],
      error: "Ratio terms must be positive integers.",
    });
  });
});
