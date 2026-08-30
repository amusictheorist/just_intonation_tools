import { describe, expect, it } from "vitest";
import { isStandardCubicConnectionVisible } from "./isStandardCubicConnectionVisible";

describe("isStandardCubicConnectionVisible", () => {
  it("connects axis-aligned points when no point lies between them", () => {
    expect(
      isStandardCubicConnectionVisible(
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        [],
      ),
    ).toBe(true);
  });

  it("does not connect axis-aligned points when another point lies between them", () => {
    expect(
      isStandardCubicConnectionVisible(
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        [{ x: 1, y: 0, z: 0 }],
      ),
    ).toBe(false);
  });

  it("rejects points that are not aligned on a cubic axis", () => {
    expect(
      isStandardCubicConnectionVisible(
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        [],
      ),
    ).toBe(false);
  });

  it("detects an intervening point on the y axis", () => {
    expect(
      isStandardCubicConnectionVisible(
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 2, z: 0 },
        [{ x: 0, y: 1, z: 0 }],
      ),
    ).toBe(false);
  });

  it("detects an intervening point on the z axis", () => {
    expect(
      isStandardCubicConnectionVisible(
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 2 },
        [{ x: 0, y: 0, z: 1 }],
      ),
    ).toBe(false);
  });

  it("ignores points that do not lie between the algined points", () => {
    expect(
      isStandardCubicConnectionVisible(
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        [{ x: 1, y: 1, z: 0 }],
      ),
    ).toBe(true);
  });
});
