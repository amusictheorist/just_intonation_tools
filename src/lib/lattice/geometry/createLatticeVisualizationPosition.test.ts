import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";
import { createLatticeVisualizationPosition } from "./createLatticeVisualizationPosition";
import { createRadialPosition } from "./createRadialPosition";
import { resolveTestPrimeAnchorVector } from "./test/resolveTestPrimeAnchorVector";

describe("createLatticeVisualizationPosition", () => {
  it("creates a position from standard cubic placement", () => {
    expect(
      createLatticeVisualizationPosition({
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: {
              x: 1,
              y: -2,
              z: 3,
            },
          },
        },
        geometry: {
          type: "cubic",
        },
      }),
    ).toEqual({
      x: 1,
      y: -2,
      z: 3,
    });
  });

  it("creates a position from expanded cubic placement", () => {
    expect(
      createLatticeVisualizationPosition(
        {
          placement: {
            type: "cubic",
            placement: {
              type: "expanded",
              address: {
                anchorPath: [{ prime: 11n, direction: 1 }],
                coordinates357: {
                  x: 1,
                  y: 2,
                  z: 3,
                },
              },
            },
          },
          geometry: {
            type: "cubic",
          },
        },
        resolveTestPrimeAnchorVector,
      ),
    ).toEqual({
      x: 3,
      y: 2,
      z: 3,
    });
  });

  it("creates a position from standard radial placement", () => {
    const address = {
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    expect(
      createLatticeVisualizationPosition({
        placement: {
          type: "radial",
          placement: {
            type: "standard",
            address,
          },
        },
        geometry: {
          type: "radial",
          includeGeneratorHeight: true,
          lowerSymmetry: "continuous",
        },
      }),
    ).toEqual(createRadialPosition(address, true));
  });

  it("creates a position from expanded radial placement", () => {
    const address = {
      normalizedRatio: createTestRatio(3n, 4n),
      side: "lower" as const,
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    expect(
      createLatticeVisualizationPosition({
        placement: {
          type: "radial",
          placement: {
            type: "expanded",
            address,
          },
        },
        geometry: {
          type: "radial",
          includeGeneratorHeight: true,
          lowerSymmetry: "continuous",
        },
      }),
    ).toEqual(createExpandedRadialPosition(address, true, "continuous"));
  });
});
