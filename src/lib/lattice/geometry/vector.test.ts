import { describe, expect, it } from "vitest";
import {
  addVectors,
  crossProduct,
  dotProduct,
  normalizeVector,
  scaleVector,
} from "./vector";

describe("addVectors", () => {
  it("adds two three-dimensional vectors", () => {
    expect(addVectors({ x: 1, y: 2, z: 3 }, { x: 4, y: -1, z: 2 })).toEqual({
      x: 5,
      y: 1,
      z: 5,
    });
  });
});

describe("scaleVector", () => {
  it("scales a three-dimensional vector", () => {
    expect(scaleVector({ x: 1, y: -2, z: 3 }, 2)).toEqual({
      x: 2,
      y: -4,
      z: 6,
    });
  });
});

describe("dotProduct", () => {
  it("calculates the dot product of two vectors", () => {
    expect(dotProduct({ x: 1, y: 2, z: 3 }, { x: 4, y: -1, z: 2 })).toBe(8);
  });
});

describe("crossProduct", () => {
  it("calculates the cross product of two vectors", () => {
    expect(crossProduct({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toEqual({
      x: 0,
      y: 0,
      z: 1,
    });
  });
});

describe("normalizeVector", () => {
  it("normalizes a vector to unit length", () => {
    const normalized = normalizeVector({
      x: 3,
      y: 4,
      z: 0,
    });

    expect(normalized.x).toBeCloseTo(0.6);
    expect(normalized.y).toBeCloseTo(0.8);
    expect(normalized.z).toBeCloseTo(0);
  });

  it("throws when normalizing the zero vector", () => {
    expect(() =>
      normalizeVector({
        x: 0,
        y: 0,
        z: 0,
      }),
    ).toThrow("Cannot normalize the zero vector");
  });
});
