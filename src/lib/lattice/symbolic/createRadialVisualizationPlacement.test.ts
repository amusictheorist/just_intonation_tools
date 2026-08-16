import { describe, expect, it } from "vitest";
import { createRadialVisualizationPlacement } from "./createRadialVisualizationPlacement";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createRadialVisualizationPlacement", () => {
  it("uses standard radial placement when lower-octave placement is disabled", () => {
    expect(
      createRadialVisualizationPlacement(createTestRatio(3n, 2n), false),
    ).toEqual({
      type: "standard",
      address: {
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });

  it("uses expanded radial placement when lower-octave placement is enabled", () => {
    expect(
      createRadialVisualizationPlacement(createTestRatio(3n, 4n), true),
    ).toEqual({
      type: "expanded",
      address: {
        normalizedRatio: createTestRatio(3n, 4n),
        side: "lower",
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });

  it("uses standard radial placement when lower-octave placement is disabled", () => {
    expect(
      createRadialVisualizationPlacement(createTestRatio(3n, 4n), false),
    ).toEqual({
      type: "standard",
      address: {
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
    });
  });
});
