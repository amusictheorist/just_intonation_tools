import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { coordinateArbitrary } from "./coordinateArbitrary";
import { createLocalFrame } from "./createLocalFrame";
import { transformLocalVector } from "./transformLocalVector";
import { vectorLength } from "./vector";

describe("transformLocalVector properties", () => {
  it("preserves vector length in an orthonormal frame", () => {
    fc.assert(
      fc.property(
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (
          originX,
          originY,
          originZ,
          directionX,
          directionY,
          directionZ,
          x,
          y,
          z,
        ) => {
          fc.pre(directionX !== 0 || directionY !== 0 || directionZ !== 0);

          const frame = createLocalFrame(
            {
              x: originX,
              y: originY,
              z: originZ,
            },
            {
              x: directionX,
              y: directionY,
              z: directionZ,
            },
          );

          const vector = { x, y, z };
          const transformed = transformLocalVector(vector, frame);

          expect(vectorLength(transformed)).toBeCloseTo(vectorLength(vector));
        },
      ),
    );
  });
});
