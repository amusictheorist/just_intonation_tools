import { describe, expect, it } from "vitest";
import { createCubicCoordinates } from "./createCubicCoordinates";

describe("createCubicCoordinates", () => {
  it("places unison at the origin", () => {
    expect(createCubicCoordinates(new Map())).toEqual({
      x: 0,
      y: 0,
      z: 0,
    });
  });

  it("maps the exponent of 3 to the x-axis", () => {
    expect(createCubicCoordinates(new Map([[3n, 1]]))).toEqual({
      x: 1,
      y: 0,
      z: 0,
    });
  });

  it("maps the exponent of 5 to the y-axis", () => {
    expect(createCubicCoordinates(new Map([[5n, 1]]))).toEqual({
      x: 0,
      y: 1,
      z: 0,
    });
  });

  it("maps the exponent of 7 to the z-axis", () => {
    expect(createCubicCoordinates(new Map([[7n, 1]]))).toEqual({
      x: 0,
      y: 0,
      z: 1,
    });
  });

  it("maps negative exponents to negative coordinates", () => {
    expect(
      createCubicCoordinates(
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
      createCubicCoordinates(
        new Map([
          [3n, 1],
          [11n, 1],
        ]),
      ),
    ).toBeNull();
  });

  it("maps 3, 5, zand 7 to cubic coordinates", () => {
    expect(
      createCubicCoordinates(
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
