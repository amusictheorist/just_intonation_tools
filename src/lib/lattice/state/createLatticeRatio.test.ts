import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createLatticeRatio } from "./createLatticeRatio";

describe("createLatticeRatio", () => {
  it("creates lattice state from application identity, raw input, and an exact ratio", () => {
    const ratio = createTestRatio(3n, 2n);

    expect(createLatticeRatio("ratio-1", "3/2", ratio)).toEqual({
      id: "ratio-1",
      rawInput: "3/2",
      ratio,
    });
  });
});
