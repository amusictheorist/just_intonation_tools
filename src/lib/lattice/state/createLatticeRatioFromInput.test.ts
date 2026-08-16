import { describe, expect, it } from "vitest";
import { createLatticeRatioFromInput } from "./createLatticeRatioFromInput";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createLatticeRatioFromInput", () => {
  it("creates lattice state from valid ratio input", () => {
    expect(createLatticeRatioFromInput("ratio-1", "3/2")).toEqual({
      success: true,
      latticeRatio: {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: createTestRatio(3n, 2n),
      },
    });
  });

  it("returns the parser error for invalid ratio input", () => {
    expect(createLatticeRatioFromInput("ratio-1", "3/0")).toEqual({
      success: false,
      error: "Ratio terms must be positive integers.",
    });
  });
});
