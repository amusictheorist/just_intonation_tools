import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createPositionedLatticeRatios } from "./createPositionedLatticeRatios";
import { createExpandedRadialPosition } from "../geometry/createExpandedRadialPosition";
import {
  RADIAL_HORIZONTAL_SPACING,
  RADIAL_VERTICAL_SPACING,
} from "../geometry/latticeGeometryConstants";

describe("createPositionedLatticeRatios", () => {
  it("creates positions for stored ratios visible in a cubic visualization", () => {
    const latticeRatio = {
      id: "ratio-1",
      rawInput: "15/8",
      ratio: createTestRatio(15n, 8n),
    };

    expect(
      createPositionedLatticeRatios([latticeRatio], {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
        },
      }),
    ).toEqual([
      {
        latticeRatio,
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: { x: 1, y: 1, z: 0 },
          },
        },
        position: {
          x: 2,
          y: 2,
          z: 0,
        },
      },
    ]);
  });

  it("creates positions for stored ratios visible in a radial visualization", () => {
    const latticeRatio = {
      id: "ratio-1",
      rawInput: "3/4",
      ratio: createTestRatio(3n, 4n),
    };

    const address = {
      normalizedRatio: createTestRatio(3n, 4n),
      side: "lower" as const,
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    const radialPosition = createExpandedRadialPosition(
      address,
      true,
      "continuous",
    );

    expect(
      createPositionedLatticeRatios([latticeRatio], {
        visualization: {
          type: "radial",
          includeLowerOctave: true,
        },
        geometry: {
          type: "radial",
          includeGeneratorHeight: true,
          lowerSymmetry: "continuous",
        },
      }),
    ).toEqual([
      {
        latticeRatio,
        placement: {
          type: "radial",
          placement: {
            type: "expanded",
            address,
          },
        },
        position: {
          x: radialPosition.x * RADIAL_HORIZONTAL_SPACING,
          y: radialPosition.y * RADIAL_VERTICAL_SPACING,
          z: radialPosition.z * RADIAL_HORIZONTAL_SPACING,
        },
      },
    ]);
  });

  it("omits stored ratios that are hidden by the current visualization", () => {
    const visibleRatio = {
      id: "ratio-1",
      rawInput: "3/2",
      ratio: createTestRatio(3n, 2n),
    };
    const hiddenRatio = {
      id: "ratio-2",
      rawInput: "11/8",
      ratio: createTestRatio(11n, 8n),
    };

    expect(
      createPositionedLatticeRatios([visibleRatio, hiddenRatio], {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
        },
      }),
    ).toEqual([
      {
        latticeRatio: visibleRatio,
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: { x: 1, y: 0, z: 0 },
          },
        },
        position: {
          x: 2,
          y: 0,
          z: 0,
        },
      },
    ]);
  });

  it("preserves the order of positioned ratios", () => {
    const firstRatio = {
      id: "ratio-1",
      rawInput: "3/2",
      ratio: createTestRatio(3n, 2n),
    };
    const secondRatio = {
      id: "ratio-2",
      rawInput: "5/4",
      ratio: createTestRatio(5n, 4n),
    };

    expect(
      createPositionedLatticeRatios([firstRatio, secondRatio], {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
        },
      }),
    ).toEqual([
      {
        latticeRatio: firstRatio,
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: { x: 1, y: 0, z: 0 },
          },
        },
        position: {
          x: 2,
          y: 0,
          z: 0,
        },
      },
      {
        latticeRatio: secondRatio,
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: { x: 0, y: 1, z: 0 },
          },
        },
        position: {
          x: 0,
          y: 2,
          z: 0,
        },
      },
    ]);
  });
});
