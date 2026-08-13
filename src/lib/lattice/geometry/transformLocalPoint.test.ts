import { describe, expect, it } from "vitest";
import { transformLocalPoint } from "./transformLocalPoint";

describe("transformLocalPoint", () => {
  it("adds the frame origin to the transformed local point", () => {
    expect(
      transformLocalPoint(
        { x: 2, y: -1, z: 3 },
        {
          origin: { x: 10, y: 20, z: 30 },
          xAxis: { x: 1, y: 0, z: 0 },
          yAxis: { x: 0, y: 1, z: 0 },
          zAxis: { x: 0, y: 0, z: 1 },
        },
      ),
    ).toEqual({ x: 12, y: 19, z: 33 });
  });

  it("transforms a point through a rotated and translated frame", () => {
    expect(
      transformLocalPoint(
        { x: 2, y: 3, z: 4 },
        {
          origin: { x: 10, y: 20, z: 30 },
          xAxis: { x: 0, y: 1, z: 0 },
          yAxis: { x: 1, y: 0, z: 0 },
          zAxis: { x: 0, y: 0, z: 1 },
        },
      ),
    ).toEqual({ x: 13, y: 22, z: 34 });
  });
});
