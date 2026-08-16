import { describe, expect, it } from "vitest";
import { createCubicVisualizationPlacement } from "./createCubicVisualizationPlacement";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createCubicVisualizationPlacement", () => {
  it("uses standard cubic placement when higher primes are disabled", () => {
    expect(
      createCubicVisualizationPlacement(createTestRatio(15n, 8n), false),
    ).toEqual({
      type: "standard",
      coordinates: {
        x: 1,
        y: 1,
        z: 0,
      },
    });
  });

  it("uses expanded cubic placement for a higher-prime ratio when higher primes are enabled", () => {
    expect(
      createCubicVisualizationPlacement(createTestRatio(11n, 8n), true),
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

  it("uses expanded cubic placement for a 7-limit ratio when higher primes are enabled", () => {
    expect(
      createCubicVisualizationPlacement(createTestRatio(15n, 8n), true),
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

  it("return null for a higher-prime ratio when higher primes are disabled", () => {
    expect(
      createCubicVisualizationPlacement(createTestRatio(11n, 8n), false),
    ).toBeNull();
  });
});
