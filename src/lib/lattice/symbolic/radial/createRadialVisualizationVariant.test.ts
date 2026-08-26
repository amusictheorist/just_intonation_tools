import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../../ji/test/ratioTestHelpers";
import { createRadialVisualizationVariant } from "./createRadialVisualizationVariant";

describe("createRadialVisualizationVariant", () => {
  it("uses the standard radial variant when lower-octave placement is disabled", () => {
    const normalizedRatio = createTestRatio(3n, 2n);

    expect(createRadialVisualizationVariant(normalizedRatio, false)).toEqual({
      type: "standard",
      address: {
        normalizedRatio,
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });

  it("uses the expanded radial variant when lower-octave placement is enabled", () => {
    const ratio = createTestRatio(3n, 4n);

    expect(createRadialVisualizationVariant(ratio, true)).toEqual({
      type: "expanded",
      address: {
        normalizedRatio: ratio,
        side: "lower",
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });

  it("normalizes lower-octave ratios into the upper octave for the standard radial variant", () => {
    const ratio = createTestRatio(3n, 4n);
    const normalizedRatio = createTestRatio(3n, 2n);

    expect(createRadialVisualizationVariant(ratio, false)).toEqual({
      type: "standard",
      address: {
        normalizedRatio,
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });
});
