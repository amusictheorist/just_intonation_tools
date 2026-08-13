import { describe, expect, it } from "vitest";
import { createAnchorFrameFromPrimePath } from "./createAnchorFrameFromPrimePath";

describe("createAnchorFrameFromPrimePath", () => {
  it("creates nested anchors from prime-factor steps in order", () => {
    const initialFrame = {
      origin: { x: 0, y: 0, z: 0 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    function resolveAnchorVector(step: { prime: bigint; direction: 1 | -1 }) {
      if (step.prime === 11n) {
        return { x: 2, y: 0, z: 0 };
      }

      return { x: 0, y: 0, z: 3 };
    }

    const frame = createAnchorFrameFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
      ],
      initialFrame,
      resolveAnchorVector,
    );

    expect(frame.origin).toEqual({ x: 5, y: 0, z: 0 });
  });

  it("uses the resolver's inverse vector for a negative prime step", () => {
    const initialFrame = {
      origin: { x: 0, y: 0, z: 0 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    function resolveAnchorVector(step: { prime: bigint; direction: 1 | -1 }) {
      const vector = { x: 2, y: 0, z: 0 };

      if (step.direction === -1) {
        return {
          x: -vector.x,
          y: -vector.y,
          z: -vector.z,
        };
      }

      return vector;
    }

    const frame = createAnchorFrameFromPrimePath(
      [{ prime: 11n, direction: -1 }],
      initialFrame,
      resolveAnchorVector,
    );

    expect(frame.origin).toEqual({ x: -2, y: 0, z: 0 });

    expect(frame.zAxis.x).toBeCloseTo(-1);
    expect(frame.zAxis.y).toBeCloseTo(0);
    expect(frame.zAxis.z).toBeCloseTo(0);
  });

  it("applies repeated prime steps as repeated nested anchor movements", () => {
    const initialFrame = {
      origin: { x: 0, y: 0, z: 0 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    function resolveAnchorVector() {
      return { x: 0, y: 0, z: 2 };
    }

    const frame = createAnchorFrameFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 11n, direction: 1 },
      ],
      initialFrame,
      resolveAnchorVector,
    );

    expect(frame.origin.x).toBeCloseTo(0);
    expect(frame.origin.y).toBeCloseTo(0);
    expect(frame.origin.z).toBeCloseTo(4);
  });

  it("returns the initial frame for an empty prime path", () => {
    const initialFrame = {
      origin: { x: 10, y: 20, z: 30 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      zAxis: { x: 0, y: 0, z: 1 },
    };

    function resolveAnchorVector() {
      return { x: 1, y: 0, z: 0 };
    }

    expect(
      createAnchorFrameFromPrimePath([], initialFrame, resolveAnchorVector),
    ).toEqual(initialFrame);
  });
});
