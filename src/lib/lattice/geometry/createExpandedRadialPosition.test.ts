import { describe, expect, it } from "vitest";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";
import { createRadialPosition } from "./createRadialPosition";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createExpandedRadialPosition", () => {
  it("uses ordinary radial placement for an upper-side address", () => {
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

    expect(position.y).toBe(1);
  });

  it("reflects a lower-side address through the origin in continuous mode", () => {
    const address = {
      normalizedRatio: createTestRatio(2n, 3n),
      side: "lower" as const,
      path: [{ prime: 3n, direction: -1 as const }],
      distance: 1,
    };

    const ordinaryPosition = createRadialPosition(address, true);
    const position = createExpandedRadialPosition(address, true, "continuous");

    expect(position.x).toBeCloseTo(-ordinaryPosition.x);
    expect(position.y).toBeCloseTo(-ordinaryPosition.y);
    expect(position.z).toBeCloseTo(-ordinaryPosition.z);
  });

  it("reflects only the vertical coordinate in aligned mode", () => {
    const address = {
      normalizedRatio: createTestRatio(2n, 3n),
      side: "lower" as const,
      path: [{ prime: 3n, direction: -1 as const }],
      distance: 1,
    };

    const ordinaryPosition = createRadialPosition(address, true);
    const position = createExpandedRadialPosition(address, true, "aligned");

    expect(position.x).toBeCloseTo(ordinaryPosition.x);
    expect(position.y).toBeCloseTo(-ordinaryPosition.y);
    expect(position.z).toBeCloseTo(ordinaryPosition.z);
  });

  it("ignores lower-side symmetry for upper-side addresses", () => {
    const address = {
      normalizedRatio: createTestRatio(3n, 2n),
      side: "upper" as const,
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    const ordinaryPosition = createRadialPosition(address, true);
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

    expect(continuousPosition.x).toBeCloseTo(ordinaryPosition.x);
    expect(continuousPosition.y).toBeCloseTo(ordinaryPosition.y);
    expect(continuousPosition.z).toBeCloseTo(ordinaryPosition.z);

    expect(alignedPosition.x).toBeCloseTo(ordinaryPosition.x);
    expect(alignedPosition.y).toBeCloseTo(ordinaryPosition.y);
    expect(alignedPosition.z).toBeCloseTo(ordinaryPosition.z);
  });

  it("uses ordinary radial prime placement for higher primes", () => {
    const address = {
      normalizedRatio: createTestRatio(11n, 8n),
      side: "upper" as const,
      path: [{ prime: 11n, direction: 1 as const }],
      distance: 1,
    };

    const ordinaryPosition = createRadialPosition(address, true);
    const expandedPosition = createExpandedRadialPosition(
      address,
      true,
      "continuous",
    );

    expect(expandedPosition.x).toBeCloseTo(ordinaryPosition.x);
    expect(expandedPosition.y).toBeCloseTo(ordinaryPosition.y);
    expect(expandedPosition.z).toBeCloseTo(ordinaryPosition.z);
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
