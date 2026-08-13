import { describe, expect, it } from "vitest";
import { createLocalFrame } from "./createLocalFrame";
import { dotProduct } from "./vector";

describe("createLocalFrame", () => {
  it("uses the supplied direction as the local z-axis", () => {
    expect(
      createLocalFrame({ x: 0, y: 0, z: 2 }, { x: 0, y: 0, z: 2 }),
    ).toEqual({
      origin: { x: 0, y: 0, z: 2 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    });
  });

  it("normalizes the supplied direction as the local z-axis", () => {
    const frame = createLocalFrame({ x: 2, y: 0, z: 0 }, { x: 2, y: 0, z: 0 });

    expect(frame.origin).toEqual({ x: 2, y: 0, z: 0 });
    expect(frame.zAxis).toEqual({ x: 1, y: 0, z: 0 });
  });

  it("keeps the frame origin independent of its direction", () => {
    const frame = createLocalFrame(
      { x: 10, y: 20, z: 30 },
      { x: 0, y: 0, z: 2 },
    );

    expect(frame.origin).toEqual({ x: 10, y: 20, z: 30 });
    expect(frame.zAxis).toEqual({ x: 0, y: 0, z: 1 });
  });

  it("creates an x-axis perpendicular to the local z-axis", () => {
    const frame = createLocalFrame(
      { x: 10, y: 20, z: 30 },
      { x: 1, y: 1, z: 0 },
    );

    expect(dotProduct(frame.xAxis, frame.zAxis)).toBeCloseTo(0);
  });

  it("creates a y-axis perpendicular to both local x and z axes", () => {
    const frame = createLocalFrame(
      { x: 10, y: 20, z: 30 },
      { x: 1, y: 1, z: 1 },
    );

    expect(dotProduct(frame.yAxis, frame.xAxis)).toBeCloseTo(0);
    expect(dotProduct(frame.yAxis, frame.zAxis)).toBeCloseTo(0);
  });

  it("creates a valid frame when the direction is parallel to global up", () => {
    const frame = createLocalFrame(
      { x: 10, y: 20, z: 30 },
      { x: 0, y: 2, z: 0 },
    );

    expect(frame.zAxis).toEqual({ x: 0, y: 1, z: 0 });

    expect(dotProduct(frame.xAxis, frame.zAxis)).toBeCloseTo(0);
    expect(dotProduct(frame.yAxis, frame.zAxis)).toBeCloseTo(0);
    expect(dotProduct(frame.xAxis, frame.yAxis)).toBeCloseTo(0);
  });

  it("creates a valid frame when the direction is nearly parallel to global up", () => {
    const frame = createLocalFrame(
      { x: 10, y: 20, z: 30 },
      { x: 0.000001, y: 1, z: 0 },
    );

    expect(dotProduct(frame.xAxis, frame.zAxis)).toBeCloseTo(0);
    expect(dotProduct(frame.yAxis, frame.zAxis)).toBeCloseTo(0);
    expect(dotProduct(frame.xAxis, frame.yAxis)).toBeCloseTo(0);
  });
});
