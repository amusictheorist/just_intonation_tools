import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createRadialDirectionVector } from "./createRadialDirectionVector";
import { vectorLength } from "./vector";

describe("createRadialDirectionVector properties", () => {
  it("always returns a unit vector", () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -360,
          max: 360,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        (angleDegrees) => {
          const vector = createRadialDirectionVector(angleDegrees);
          const length = vectorLength(vector);

          expect(length).toBeCloseTo(1);
        },
      ),
    );
  });
});
