import { describe, expect, it } from "vitest";
import { transformLocalVector } from "./transformLocalVector";

describe("transformLocalVector", () => {
  it("preserves a vector in the identity frame", () => {
    expect(
      transformLocalVector(
        { x: 2, y: -1, z: 3 },
        {
          origin: { x: 0, y: 0, z: 0 },
          xAxis: { x: 1, y: 0, z: 0 },
          yAxis: { x: 0, y: 1, z: 0 },
          zAxis: { x: 0, y: 0, z: 1 },
        },
      ),
    ).toEqual({ x: 2, y: -1, z: 3 });
  });

  it("transforms a vector through a rotated frame", () => {
    expect(
      transformLocalVector(
        { x: 2, y: 3, z: 4 },
        {
          origin: { x: 10, y: 20, z: 30 },
          xAxis: { x: 0, y: 1, z: 0 },
          yAxis: { x: 1, y: 0, z: 0 },
          zAxis: { x: 0, y: 0, z: 1 },
        },
      ),
    ).toEqual({ x: 3, y: 2, z: 4 });
  });
});
