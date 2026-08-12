import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createCubicCoordinates } from "./createCubicCoordinates";

describe("createCubicCoordinates properties", () => {
  it("maps 3, 5, and 7 exponents directly to cubic coordinates", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -10, max: 10 }),
        fc.integer({ min: -10, max: 10 }),
        fc.integer({ min: -10, max: 10 }),
        (x, y, z) => {
          const factors = new Map<bigint, number>();

          if (x !== 0) factors.set(3n, x);
          if (y !== 0) factors.set(5n, y);
          if (z !== 0) factors.set(7n, z);

          expect(createCubicCoordinates(factors)).toEqual({ x, y, z });
        },
      ),
    );
  });

  it("returns null when any prime above 7 is present", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(11n, 13n, 17n, 19n, 23n),
        fc.integer({ min: -10, max: 10 }).filter((value) => value !== 0),
        (prime, exponent) => {
          const factors = new Map<bigint, number>([
            [3n, 1],
            [prime, exponent],
          ]);

          expect(createCubicCoordinates(factors)).toBeNull();
        },
      ),
    );
  });
});
