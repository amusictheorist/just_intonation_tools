import { describe, expect, it } from "vitest";
import { invertRatio } from "./invertRatio";
import { createTestRatio } from "../test/ratioTestHelpers";

describe("inverRatio", () => {
  it("returns the reciprocal of a ratio", () => {
    expect(invertRatio(createTestRatio(3n, 2n))).toEqual(
      createTestRatio(2n, 3n),
    );
  });
});
