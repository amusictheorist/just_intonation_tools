import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";

describe("createExpandedRadialPosition", () => {
  it("places an upper-side ratio at positive generator height", () => {
    const position = createExpandedRadialPosition(
      {
        normalizedRatio: createTestRatio(3n, 2n),
        side: "upper",
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
      true,
      "continuous",
    );

    expect(position.y).toBeCloseTo(1);
  });

  it("aligns corresponding upper- and lower-side ratios at the same angle", () => {
    const upperPosition = createExpandedRadialPosition(
      {
        normalizedRatio: createTestRatio(3n, 2n),
        side: "upper",
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
      true,
      "aligned",
    );

    const lowerPosition = createExpandedRadialPosition(
      {
        normalizedRatio: createTestRatio(2n, 3n),
        side: "lower",
        path: [{ prime: 3n, direction: -1 }],
        distance: 1,
      },
      true,
      "aligned",
    );

    expect(lowerPosition.x).toBeCloseTo(upperPosition.x);
    expect(lowerPosition.z).toBeCloseTo(upperPosition.z);
    expect(lowerPosition.y).toBeCloseTo(-upperPosition.y);
  });

  it("rotates the lower-side position by 180 degrees in continuous mode", () => {
    const alignedPosition = createExpandedRadialPosition(
      {
        normalizedRatio: createTestRatio(2n, 3n),
        side: "lower",
        path: [{ prime: 3n, direction: -1 }],
        distance: 1,
      },
      true,
      "aligned",
    );

    const continuousPosition = createExpandedRadialPosition(
      {
        normalizedRatio: createTestRatio(2n, 3n),
        side: "lower",
        path: [{ prime: 3n, direction: -1 }],
        distance: 1,
      },
      true,
      "continuous",
    );

    expect(continuousPosition.x).toBeCloseTo(-alignedPosition.x);
    expect(continuousPosition.z).toBeCloseTo(-alignedPosition.z);
    expect(continuousPosition.y).toBeCloseTo(alignedPosition.y);
  });

  it("ignores lower-side symmetry for upper-side addresses", () => {
    const address = {
      normalizedRatio: createTestRatio(3n, 2n),
      side: "upper" as const,
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    const continuousPosition = createExpandedRadialPosition(
      address,
      true,
      "continuous",
    );

    const alignedPosition = createExpandedRadialPosition(
      address,
      true,
      "aligned",
    );

    expect(continuousPosition.x).toBeCloseTo(alignedPosition.x);
    expect(continuousPosition.y).toBeCloseTo(alignedPosition.y);
    expect(continuousPosition.z).toBeCloseTo(alignedPosition.z);
  });

  it("keeps lower-side placement flattened when generator height is disabled", () => {
    const address = {
      normalizedRatio: createTestRatio(2n, 3n),
      side: "lower" as const,
      path: [{ prime: 3n, direction: -1 as const }],
      distance: 1,
    };

    const continuousPosition = createExpandedRadialPosition(
      address,
      false,
      "continuous",
    );

    const alignedPosition = createExpandedRadialPosition(
      address,
      false,
      "aligned",
    );

    expect(continuousPosition.y).toBeCloseTo(0);
    expect(alignedPosition.y).toBeCloseTo(0);
  });
});
