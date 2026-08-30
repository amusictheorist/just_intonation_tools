import { describe, expect, it } from "vitest";
import { areStandardCubicPointsAxisAligned } from "./areStandardCubicPointsAxisAligned";

describe("areStandardCubicPointsAxisAligned", () => {
  it("identifies points separated along one cubic axis", () => {
    expect(
      areStandardCubicPointsAxisAligned(
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
      ),
    ).toBe(true);
  });

  it("identifies points separated by multiple steps on one cubic axis", () => {
    expect(
      areStandardCubicPointsAxisAligned(
        { x: 0, y: 0, z: 0 },
        { x: 3, y: 0, z: 0 },
      ),
    ).toBe(true);
  });

  it("rejects points separated along more than one cubic axis", () => {
    expect(
      areStandardCubicPointsAxisAligned(
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
      ),
    ).toBe(false);
  });
});
