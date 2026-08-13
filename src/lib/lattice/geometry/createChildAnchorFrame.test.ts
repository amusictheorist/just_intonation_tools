import { describe, expect, it } from "vitest";
import { createChildAnchorFrame } from "./createChildAnchorFrame";

describe("createChildAnchorFrame", () => {
  it("orients the child frame along the parent-to-child direction", () => {
    const parentFrame = {
      origin: { x: 10, y: 0, z: 0 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    const frame = createChildAnchorFrame({ x: 0, y: 0, z: 2 }, parentFrame);

    expect(frame.origin).toEqual({ x: 10, y: 0, z: 2 });
    expect(frame.zAxis).toEqual({ x: 0, y: 0, z: 1 });
  });

  it("orients the child frame using the rotated parent basis", () => {
    const parentFrame = {
      origin: { x: 10, y: 20, z: 30 },
      xAxis: { x: 0, y: 1, z: 0 },
      yAxis: { x: 1, y: 0, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    const frame = createChildAnchorFrame({ x: 2, y: 0, z: 0 }, parentFrame);

    expect(frame.origin).toEqual({ x: 10, y: 22, z: 30 });
    expect(frame.zAxis).toEqual({ x: 0, y: 1, z: 0 });
  });
});
