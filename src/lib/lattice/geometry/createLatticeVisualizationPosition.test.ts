import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";
import { createLatticeVisualizationPosition } from "./createLatticeVisualizationPosition";
import { createRadialPosition } from "./createRadialPosition";
import { resolveTestPrimeAnchorVector } from "./test/resolveTestPrimeAnchorVector";
import {
  DEFAULT_CUBIC_LOCAL_ROTATION,
  DEFAULT_HIGHER_PRIME_RADIUS,
  RADIAL_HORIZONTAL_SPACING,
  RADIAL_VERTICAL_SPACING,
} from "./latticeGeometryConstants";

describe("createLatticeVisualizationPosition", () => {
  it("creates a position from standard cubic placement", () => {
    const latticeVisualizationPosition = createLatticeVisualizationPosition({
      placement: {
        type: "cubic",
        variant: {
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
        higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
        localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
      },
    });

    expect(latticeVisualizationPosition).toEqual({
      x: 2,
      y: -4,
      z: 6,
    });
  });

  it("creates a position from expanded cubic placement", () => {
    expect(
      createLatticeVisualizationPosition(
        {
          placement: {
            type: "cubic",
            variant: {
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
            higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        },
        resolveTestPrimeAnchorVector,
      ),
    ).toEqual({
      x: 6,
      y: 4,
      z: 6,
    });
  });

  it("creates a position from standard radial placement", () => {
    const address = {
      normalizedRatio: createTestRatio(3n, 2n),
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    const position = createRadialPosition(address, true);

    expect(
      createLatticeVisualizationPosition({
        placement: {
          type: "radial",
          variant: {
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
    ).toEqual({
      x: position.x * RADIAL_HORIZONTAL_SPACING,
      y: position.y * RADIAL_VERTICAL_SPACING,
      z: position.z * RADIAL_HORIZONTAL_SPACING,
    });
  });

  it("creates a position from expanded radial placement", () => {
    const address = {
      normalizedRatio: createTestRatio(3n, 4n),
      side: "lower" as const,
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    const position = createExpandedRadialPosition(address, true, "continuous");

    expect(
      createLatticeVisualizationPosition({
        placement: {
          type: "radial",
          variant: {
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
    ).toEqual({
      x: position.x * RADIAL_HORIZONTAL_SPACING,
      y: position.y * RADIAL_VERTICAL_SPACING,
      z: position.z * RADIAL_HORIZONTAL_SPACING,
    });
  });

  it("scales higher-prime anchor displacement by the configured radius", () => {
    expect(
      createLatticeVisualizationPosition(
        {
          placement: {
            type: "cubic",
            variant: {
              type: "expanded",
              address: {
                anchorPath: [{ prime: 11n, direction: 1 }],
                coordinates357: { x: 0, y: 0, z: 0 },
              },
            },
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 3,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        },
        resolveTestPrimeAnchorVector,
      ),
    ).toEqual({ x: 12, y: 0, z: 0 });
  });

  it("rotates local expanded-cubic coordinates without rotating the anchor", () => {
    const position = createLatticeVisualizationPosition(
      {
        placement: {
          type: "cubic",
          variant: {
            type: "expanded",
            address: {
              anchorPath: [{ prime: 11n, direction: 1 }],
              coordinates357: { x: 1, y: 0, z: 0 },
            },
          },
        },
        geometry: {
          type: "cubic",
          higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
          localRotation: { x: 0, y: 0, z: 90 },
        },
      },
      resolveTestPrimeAnchorVector,
    );

    expect(position.x).toBeCloseTo(4);
    expect(position.y).toBeCloseTo(2);
    expect(position.z).toBeCloseTo(0);
  });
});
