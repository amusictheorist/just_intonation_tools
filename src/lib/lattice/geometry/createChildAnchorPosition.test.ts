import { describe, expect, it } from "vitest";
import { createChildAnchorPosition } from "./createChildAnchorPosition";

describe("createChildAnchorPosition", () => {
  it("places a child anchor relative to the parent frame", () => {
    const parentFrame = {
      origin: { x: 10, y: 20, z: 30 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    expect(
      createChildAnchorPosition({ x: 2, y: 3, z: 4 }, parentFrame),
    ).toEqual({
      x: 12,
      y: 23,
      z: 34,
    });
  });

  it("places a child anchor using the parent frame orientation", () => {
    const parentFrame = {
      origin: { x: 10, y: 20, z: 30 },
      xAxis: { x: 0, y: 1, z: 0 },
      yAxis: { x: 1, y: 0, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    expect(
      createChildAnchorPosition({ x: 2, y: 3, z: 4 }, parentFrame),
    ).toEqual({
      x: 13,
      y: 22,
      z: 34,
    });
  });
});
