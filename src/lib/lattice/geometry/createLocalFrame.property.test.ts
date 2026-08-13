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
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (originX, originY, originZ, x, y, z) => {
          fc.pre(x !== 0 || y !== 0 || z !== 0);

          const frame = createLocalFrame(
            {
              x: originX,
              y: originY,
              z: originZ,
            },
            { x, y, z },
          );

          for (const axis of [frame.xAxis, frame.yAxis, frame.zAxis]) {
            expect(vectorLength(axis)).toBeCloseTo(1);
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
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (originX, originY, originZ, x, y, z) => {
          fc.pre(x !== 0 || y !== 0 || z !== 0);

          const frame = createLocalFrame(
            {
              x: originX,
              y: originY,
              z: originZ,
            },
            { x, y, z },
          );

          expect(dotProduct(frame.xAxis, frame.yAxis)).toBeCloseTo(0);

          expect(dotProduct(frame.xAxis, frame.zAxis)).toBeCloseTo(0);

          expect(dotProduct(frame.yAxis, frame.zAxis)).toBeCloseTo(0);
        },
      ),
    );
  });

  it("aligns the local z-axis with the supplied direction", () => {
    fc.assert(
      fc.property(
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (originX, originY, originZ, x, y, z) => {
          fc.pre(x !== 0 || y !== 0 || z !== 0);

          const direction = { x, y, z };

          const frame = createLocalFrame(
            {
              x: originX,
              y: originY,
              z: originZ,
            },
            direction,
          );

          expect(dotProduct(frame.zAxis, direction)).toBeCloseTo(
            vectorLength(direction),
          );
        },
      ),
    );
  });
});
