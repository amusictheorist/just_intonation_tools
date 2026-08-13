import { describe, expect, it } from "vitest";
import { createNestedAnchorFrame } from "./createNestedAnchorFrame";

describe("createNestedAnchorFrame", () => {
  it("creates the final frame for a single child anchor", () => {
    const initialFrame = {
      origin: { x: 10, y: 20, z: 30 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    const frame = createNestedAnchorFrame([{ x: 0, y: 0, z: 2 }], initialFrame);

    expect(frame.origin).toEqual({ x: 10, y: 20, z: 32 });
    expect(frame.zAxis).toEqual({ x: 0, y: 0, z: 1 });
  });

  it("interprets each child anchor in the preceding child frame", () => {
    const initialFrame = {
      origin: { x: 0, y: 0, z: 0 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    const frame = createNestedAnchorFrame(
      [
        { x: 2, y: 0, z: 0 },
        { x: 0, y: 0, z: 3 },
      ],
      initialFrame,
    );

    expect(frame.origin).toEqual({ x: 5, y: 0, z: 0 });
    expect(frame.zAxis).toEqual({ x: 1, y: 0, z: 0 });
  });

  it("returns the initial frame when there are no child anchors", () => {
    const initialFrame = {
      origin: { x: 10, y: 20, z: 30 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    expect(createNestedAnchorFrame([], initialFrame)).toEqual(initialFrame);
  });
});
