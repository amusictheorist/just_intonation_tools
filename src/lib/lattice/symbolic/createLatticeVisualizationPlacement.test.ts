import { describe, expect, it } from "vitest";
import { createLatticeVisualizationPlacement } from "./createLatticeVisualizationPlacement";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createLatticeVisualizationPlacement", () => {
  it("creates symbolic placement for a cubic visualization", () => {
    expect(
      createLatticeVisualizationPlacement(createTestRatio(15n, 8n), {
        type: "cubic",
        includeHigherPrimes: false,
      }),
    ).toEqual({
      type: "cubic",
      placement: {
        type: "standard",
        coordinates: {
          x: 1,
          y: 1,
          z: 0,
        },
      },
    });
  });

  it("creates symbolic placement for a radial visualization", () => {
    expect(
      createLatticeVisualizationPlacement(createTestRatio(3n, 4n), {
        type: "radial",
        includeLowerOctave: true,
      }),
    ).toEqual({
      type: "radial",
      placement: {
        type: "expanded",
        address: {
          normalizedRatio: createTestRatio(3n, 4n),
          side: "lower",
          path: [{ prime: 3n, direction: 1 }],
          distance: 1,
        },
      },
    });
  });

  it("returns null when a cubic ratio is hidden by the visualization configuration", () => {
    expect(
      createLatticeVisualizationPlacement(createTestRatio(11n, 8n), {
        type: "cubic",
        includeHigherPrimes: false,
      }),
    ).toBeNull();
  });
});
