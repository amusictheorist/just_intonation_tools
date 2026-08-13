import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { coordinateArbitrary } from "./coordinateArbitrary";
import { createLocalFrame } from "./createLocalFrame";
import { dotProduct, vectorLength } from "./vector";

describe("createLocalFrame properties", () => {
  it("creates unit-length local axes", () => {
    fc.assert(
      fc.property(
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (x, y, z) => {
          fc.pre(x !== 0 || y !== 0 || z !== 0);

          const frame = createLocalFrame({ x, y, z });

          for (const axis of [frame.xAxis, frame.yAxis, frame.zAxis]) {
            const length = vectorLength(axis);

            expect(length).toBeCloseTo(1);
          }
        },
      ),
    );
  });

  it("creates mutually orthogonal axes", () => {
    fc.assert(
      fc.property(
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (x, y, z) => {
          fc.pre(x !== 0 || y !== 0 || z !== 0);

          const frame = createLocalFrame({ x, y, z });

          expect(dotProduct(frame.xAxis, frame.yAxis)).toBeCloseTo(0);
          expect(dotProduct(frame.xAxis, frame.zAxis)).toBeCloseTo(0);
          expect(dotProduct(frame.yAxis, frame.zAxis)).toBeCloseTo(0);
        },
      ),
    );
  });

  it("aligns the local z-axis with the anchor direction", () => {
    fc.assert(
      fc.property(
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (x, y, z) => {
          fc.pre(x !== 0 || y !== 0 || z !== 0);

          const anchor = { x, y, z };
          const frame = createLocalFrame(anchor);
          const anchorLength = vectorLength(anchor);

          expect(dotProduct(frame.zAxis, anchor)).toBeCloseTo(anchorLength);
        },
      ),
    );
  });
});
