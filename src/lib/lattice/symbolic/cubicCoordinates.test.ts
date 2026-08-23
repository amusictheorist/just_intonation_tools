import { describe, expect, it } from "vitest";
import {
  createStandardCubicCoordinates,
  extractCubicCoordinates,
} from "./cubicCoordinates";

describe("createStandardCubicCoordinates", () => {
  it("places unison at the origin", () => {
    expect(createStandardCubicCoordinates(new Map())).toEqual({
      x: 0,
      y: 0,
      z: 0,
    });
  });

  it("maps the exponent of 3 to the x-axis", () => {
    expect(createStandardCubicCoordinates(new Map([[3n, 1]]))).toEqual({
      x: 1,
      y: 0,
      z: 0,
    });
  });

  it("maps the exponent of 5 to the y-axis", () => {
    expect(createStandardCubicCoordinates(new Map([[5n, 1]]))).toEqual({
      x: 0,
      y: 1,
      z: 0,
    });
  });

  it("maps the exponent of 7 to the z-axis", () => {
    expect(createStandardCubicCoordinates(new Map([[7n, 1]]))).toEqual({
      x: 0,
      y: 0,
      z: 1,
    });
  });

  it("maps negative exponents to negative coordinates", () => {
    expect(
      createStandardCubicCoordinates(
        new Map([
          [3n, -2],
          [5n, -1],
          [7n, -3],
        ]),
      ),
    ).toEqual({
      x: -2,
      y: -1,
      z: -3,
    });
  });

  it("returns null when a prime above 7 is present", () => {
    expect(
      createStandardCubicCoordinates(
        new Map([
          [3n, 1],
          [11n, 1],
        ]),
      ),
    ).toBeNull();
  });

  it("maps 3, 5, and 7 to cubic coordinates", () => {
    expect(
      createStandardCubicCoordinates(
        new Map([
          [3n, 2],
          [5n, -1],
          [7n, 3],
        ]),
      ),
    ).toEqual({
      x: 2,
      y: -1,
      z: 3,
    });
  });
});

describe("extractCubicCoordinates", () => {
  it("places unison at the origin", () => {
    expect(extractCubicCoordinates(new Map())).toEqual({
      x: 0,
      y: 0,
      z: 0,
    });
  });

  it("maps 3, 5, and 7 exponents to cubic coordinates", () => {
    expect(
      extractCubicCoordinates(
        new Map([
          [3n, 2],
          [5n, -1],
          [7n, 3],
        ]),
      ),
    ).toEqual({
      x: 2,
      y: -1,
      z: 3,
    });
  });

  it("ignores primes above 7", () => {
    expect(
      extractCubicCoordinates(
        new Map([
          [3n, 1],
          [11n, 2],
        ]),
      ),
    ).toEqual({
      x: 1,
      y: 0,
      z: 0,
    });
  });
});
