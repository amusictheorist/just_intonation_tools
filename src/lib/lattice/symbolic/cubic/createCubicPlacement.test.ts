import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../../ji/test/ratioTestHelpers";
import { createCubicPlacement } from "./createCubicPlacement";

describe("createCubicPlacement", () => {
  it("creates standard cubic coordinates for a 7-limit ratio", () => {
    expect(createCubicPlacement(createTestRatio(15n, 8n))).toEqual({
      x: 1,
      y: 1,
      z: 0,
    });
  });

  it("returns null for a ratio containing a higher prime", () => {
    expect(createCubicPlacement(createTestRatio(11n, 8n))).toBeNull();
  });
});
