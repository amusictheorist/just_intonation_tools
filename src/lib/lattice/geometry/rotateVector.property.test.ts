import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { rotateVector } from "./rotateVector";
import { vectorLength } from "./vector";
import { vectorArbitrary } from "./test/vectorArbitrary";
import { rotationArbitrary } from "./test/rotationArbitrary";

describe("rotateVector properties", () => {
  it("preserves vector length", () => {
    fc.assert(
      fc.property(vectorArbitrary, rotationArbitrary, (vector, rotation) => {
        const rotated = rotateVector(vector, rotation);

        expect(vectorLength(rotated)).toBeCloseTo(vectorLength(vector));
      }),
    );
  });

  it("is unchanged by whole-turn rotations", () => {
    fc.assert(
      fc.property(
        vectorArbitrary,
        fc.integer({ min: -3, max: 3 }),
        fc.integer({ min: -3, max: 3 }),
        fc.integer({ min: -3, max: 3 }),
        (vector, xTurns, yTurns, zTurns) => {
          const rotated = rotateVector(vector, {
            x: xTurns * 360,
            y: yTurns * 360,
            z: zTurns * 360,
          });

          expect(rotated.x).toBeCloseTo(vector.x);
          expect(rotated.y).toBeCloseTo(vector.y);
          expect(rotated.z).toBeCloseTo(vector.z);
        },
      ),
    );
  });
});
