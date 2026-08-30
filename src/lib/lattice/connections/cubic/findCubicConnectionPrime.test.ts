import { describe, expect, it } from "vitest";
import { findCubicConnectionPrime } from "./findCubicConnectionPrime";

describe("findCubicConnectionPrime", () => {
  it("returns 3 for an x-axis connection", () => {
    expect(
      findCubicConnectionPrime({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }),
    ).toBe(3n);
  });

  it("returns 5 for a y-axis connection", () => {
    expect(
      findCubicConnectionPrime({ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
    ).toBe(5n);
  });

  it("returns 7 for a z-axis connection", () => {
    expect(
      findCubicConnectionPrime({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
    ).toBe(7n);
  });

  it("returns null when more than one coordinate differs", () => {
    expect(
      findCubicConnectionPrime({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }),
    ).toBeNull();
  });

  it("returns null for identical coordinates", () => {
    expect(
      findCubicConnectionPrime({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }),
    ).toBeNull();
  });
});
