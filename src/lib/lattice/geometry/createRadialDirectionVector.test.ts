import { describe, expect, it } from "vitest";
import { createRadialDirectionVector } from "./createRadialDirectionVector";

describe("createRadialDirectionVector", () => {
  it("places 0 degrees on the negative z-axis", () => {
    expect(createRadialDirectionVector(0)).toEqual({
      x: 0,
      y: 0,
      z: -1,
    });
  });

  it("places 90 degrees on the positive x-axis", () => {
    const vector = createRadialDirectionVector(90);

    expect(vector.x).toBeCloseTo(1);
    expect(vector.y).toBeCloseTo(0);
    expect(vector.z).toBeCloseTo(0);
  });

  it("places 180 degrees on the positive z-axis", () => {
    const vector = createRadialDirectionVector(180);

    expect(vector.x).toBeCloseTo(0);
    expect(vector.y).toBeCloseTo(0);
    expect(vector.z).toBeCloseTo(1);
  });
});
