import { describe, expect, it } from "vitest";
import { createExpandedRadialAddress } from "./createExpandedRadialAddress";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createExpandedRadialAddress", () => {
  it("places unison on the upper side with an empty path", () => {
    expect(createExpandedRadialAddress(createTestRatio(1n, 1n))).toEqual({
      normalizedRatio: createTestRatio(1n, 1n),
      side: "upper",
      path: [],
      distance: 0,
    });
  });

  it("normalizes an upper-side ratio and preserves its symbolic path", () => {
    expect(createExpandedRadialAddress(createTestRatio(11n, 1n))).toEqual({
      normalizedRatio: createTestRatio(11n, 8n),
      side: "upper",
      path: [{ prime: 11n, direction: 1 }],
      distance: 1,
    });
  });

  it("normalizes an lower-side ratio and preserves its symbolic path", () => {
    expect(createExpandedRadialAddress(createTestRatio(1n, 11n))).toEqual({
      normalizedRatio: createTestRatio(8n, 11n),
      side: "lower",
      path: [{ prime: 11n, direction: -1 }],
      distance: 1,
    });
  });

  it("preserves a mixed canonical path after expanded-radial normalization", () => {
    expect(createExpandedRadialAddress(createTestRatio(45n, 77n))).toEqual({
      normalizedRatio: createTestRatio(45n, 77n),
      side: "lower",
      path: [
        { prime: 3n, direction: 1 },
        { prime: 3n, direction: 1 },
        { prime: 5n, direction: 1 },
        { prime: 7n, direction: -1 },
        { prime: 11n, direction: -1 },
      ],
      distance: 5,
    });
  });
});
