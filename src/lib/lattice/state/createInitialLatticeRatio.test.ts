import { describe, expect, it } from "vitest";
import { createInitialLatticeRatio } from "./createInitialLatticeRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createInitialLatticeRatio", () => {
  it("creates a lattice containing only the unison ratio", () => {
    expect(createInitialLatticeRatio("ratio-1")).toEqual([
      {
        id: "ratio-1",
        rawInput: "1/1",
        ratio: createTestRatio(1n, 1n),
      },
    ]);
  });
});
