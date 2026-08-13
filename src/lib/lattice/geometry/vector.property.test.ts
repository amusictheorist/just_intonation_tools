import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { crossProduct, dotProduct, normalizeVector } from "./vector";

const coordinateArbitrary = fc
  .double({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true })
  .filter((value) => Math.abs(value) >= 1e-6 || value === 0);

describe("vector properties", () => {
  it("nomalizes nonzero vectors to unit length", () => {
    fc.assert(
      fc.property(
        coordinateArbitrary,
        coordinateArbitrary,
        coordinateArbitrary,
        (x, y, z) => {
          fc.pre(x !== 0 || y !== 0 || z !== 0);

          const normalized = normalizeVector({ x, y, z });
          const length = Math.sqrt(
            normalized.x ** 2 + normalized.y ** 2 + normalized.z ** 2,
          );

          expect(length).toBeCloseTo(1);
        },
      ),
    );
  });

  it("produces a cross product orthogonal to both inputs", () => {
    fc.assert(
      fc.property(
        fc.tuple(coordinateArbitrary, coordinateArbitrary, coordinateArbitrary),
        fc.tuple(coordinateArbitrary, coordinateArbitrary, coordinateArbitrary),
        ([ax, ay, az], [bx, by, bz]) => {
          const a = { x: ax, y: ay, z: az };
          const b = { x: bx, y: by, z: bz };
          const cross = crossProduct(a, b);

          expect(dotProduct(cross, a)).toBeCloseTo(0);
          expect(dotProduct(cross, b)).toBeCloseTo(0);
        },
      ),
    );
  });
});
