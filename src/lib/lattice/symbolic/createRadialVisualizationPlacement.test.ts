import { describe, expect, it } from "vitest";
import { createRadialVisualizationPlacement } from "./createRadialVisualizationPlacement";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createRadialVisualizationPlacement", () => {
  it("uses standard radial placement when lower-octave placement is disabled", () => {
    const normalizedRatio = createTestRatio(3n, 2n);

    expect(createRadialVisualizationPlacement(normalizedRatio, false)).toEqual({
      type: "standard",
      address: {
        normalizedRatio,
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });

  it("uses expanded radial placement when lower-octave placement is enabled", () => {
    const ratio = createTestRatio(3n, 4n);

    expect(createRadialVisualizationPlacement(ratio, true)).toEqual({
      type: "expanded",
      address: {
        normalizedRatio: ratio,
        side: "lower",
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });

  it("normalizes lower-octave ratios into the upper octave for standard radial placement", () => {
    const ratio = createTestRatio(3n, 4n);
    const normalizedRatio = createTestRatio(3n, 2n);

    expect(createRadialVisualizationPlacement(ratio, false)).toEqual({
      type: "standard",
      address: {
        normalizedRatio,
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });
});
