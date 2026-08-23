import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  crossProduct,
  dotProduct,
  normalizeVector,
  vectorLength,
} from "./vector";
import { coordinateArbitrary } from "./test/coordinateArbitrary";

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
          const length = vectorLength(normalized);

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
