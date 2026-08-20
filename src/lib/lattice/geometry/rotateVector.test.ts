import { describe, expect, it } from "vitest";
import { rotateVector } from "./rotateVector";

describe("rotateVector", () => {
  it("leaves a vector unchanged at zero rotation", () => {
    expect(rotateVector({ x: 1, y: 2, z: 3 }, { x: 0, y: 0, z: 0 })).toEqual({
      x: 1,
      y: 2,
      z: 3,
    });
  });

  it("rotates around the x axis", () => {
    const result = rotateVector({ x: 0, y: 1, z: 0 }, { x: 90, y: 0, z: 0 });

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(1);
  });

  it("rotates around the y axis", () => {
    const result = rotateVector({ x: 0, y: 0, z: 1 }, { x: 0, y: 90, z: 0 });

    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0);
  });

  it("rotates around the z axis", () => {
    const result = rotateVector({ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 90 });

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
    expect(result.z).toBeCloseTo(0);
  });
});
