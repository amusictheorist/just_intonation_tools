import { describe, expect, it } from "vitest";
import { createExpandedCubicAddress } from "./createExpandedCubicAddress";

describe("createExpandedCubicAddress", () => {
  it("places unison at the origin with no higher-prime anchors", () => {
    expect(createExpandedCubicAddress(new Map())).toEqual({
      anchorPath: [],
      coordinates357: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
  });

  it("places 3-5-7 factors in the base lattice", () => {
    expect(
      createExpandedCubicAddress(
        new Map([
          [3n, 2],
          [5n, -1],
          [7n, 1],
        ]),
      ),
    ).toEqual({
      anchorPath: [],
      coordinates357: {
        x: 2,
        y: -1,
        z: 1,
      },
    });
  });

  it("uses a higher-prime factor as an anchor path", () => {
    expect(createExpandedCubicAddress(new Map([[11n, 1]]))).toEqual({
      anchorPath: [{ prime: 11n, direction: 1 }],
      coordinates357: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
  });

  it("combines higher-prime anchors with local 3-5-7 coordinates", () => {
    expect(
      createExpandedCubicAddress(
        new Map([
          [3n, 2],
          [5n, -1],
          [11n, 1],
        ]),
      ),
    ).toEqual({
      anchorPath: [{ prime: 11n, direction: 1 }],
      coordinates357: {
        x: 2,
        y: -1,
        z: 0,
      },
    });
  });

  it("orders multiple higher-prime anchors canonically", () => {
    expect(
      createExpandedCubicAddress(
        new Map([
          [13n, 1],
          [11n, -1],
        ]),
      ),
    ).toEqual({
      anchorPath: [
        { prime: 11n, direction: -1 },
        { prime: 13n, direction: 1 },
      ],
      coordinates357: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
  });

  it("repeats higher-prime anchor steps for repeated factors", () => {
    expect(createExpandedCubicAddress(new Map([[11n, 2]]))).toEqual({
      anchorPath: [
        { prime: 11n, direction: 1 },
        { prime: 11n, direction: 1 },
      ],
      coordinates357: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
  });
});
