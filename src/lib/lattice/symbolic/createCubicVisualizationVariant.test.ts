import { describe, expect, it } from "vitest";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createCubicVisualizationVariant } from "./createCubicVisualizationVariant";

describe("createCubicVisualizationVariant", () => {
  it("uses the standard cubic variant when higher primes are disabled", () => {
    expect(
      createCubicVisualizationVariant(createTestRatio(15n, 8n), false),
    ).toEqual({
      type: "standard",
      coordinates: {
        x: 1,
        y: 1,
        z: 0,
      },
    });
  });

  it("uses the expanded cubic variant for a higher-prime ratio when higher primes are enabled", () => {
    expect(
      createCubicVisualizationVariant(createTestRatio(11n, 8n), true),
    ).toEqual({
      type: "expanded",
      address: {
        anchorPath: [{ prime: 11n, direction: 1 }],
        coordinates357: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
    });
  });

  it("uses the expanded cubic variant for a 7-limit ratio when higher primes are enabled", () => {
    expect(
      createCubicVisualizationVariant(createTestRatio(15n, 8n), true),
    ).toEqual({
      type: "expanded",
      address: {
        anchorPath: [],
        coordinates357: {
          x: 1,
          y: 1,
          z: 0,
        },
      },
    });
  });

  it("returns null for a higher-prime ratio when higher primes are disabled", () => {
    expect(
      createCubicVisualizationVariant(createTestRatio(11n, 8n), false),
    ).toBeNull();
  });
});
