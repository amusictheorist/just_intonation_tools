import { describe, expect, it } from "vitest";
import { inverRatio } from "./invertRatio";
import { createTestRatio } from "./test/ratioTestHelpers";

describe("inverRatio", () => {
  it("returns the reciprocal of a ratio", () => {
    expect(inverRatio(createTestRatio(3n, 2n))).toEqual(
      createTestRatio(2n, 3n),
    );
  });
});
