import { describe, expect, it } from "vitest";
import { createRadialPosition } from "./createRadialPosition";
import { createRadialDirectionVector } from "./createRadialDirectionVector";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { calculateRadialRatioAngle } from "./calculateRadialRatioAngle";
import { createUnisonRatio } from "../../ji/createUnisonRatio";

describe("createRadialPosition", () => {
  it("places unison at the origin", () => {
    const position = createRadialPosition(
      {
        normalizedRatio: createUnisonRatio(),
        path: [],
        distance: 0,
      },
      true,
    );

    expect(position.x).toBeCloseTo(0);
    expect(position.y).toBeCloseTo(0);
    expect(position.z).toBeCloseTo(0);
  });

  it("places a ratio along the direction determined by its normalized ratio", () => {
    const normalizedRatio = createTestRatio(3n, 2n);
    const angle = calculateRadialRatioAngle(normalizedRatio);
    const direction = createRadialDirectionVector(angle);

    const position = createRadialPosition(
      { normalizedRatio, path: [{ prime: 3n, direction: 1 }], distance: 1 },
      true,
    );

    expect(position.x).toBeCloseTo(direction.x);
    expect(position.y).toBeCloseTo(1);
    expect(position.z).toBeCloseTo(direction.z);
  });

  it("uses generator distance as the radial distance from the origin", () => {
    const normalizedRatio = createTestRatio(15n, 8n);
    const angle = calculateRadialRatioAngle(normalizedRatio);
    const direction = createRadialDirectionVector(angle);

    const position = createRadialPosition(
      {
        normalizedRatio,
        path: [
          { prime: 3n, direction: 1 },
          { prime: 5n, direction: 1 },
        ],
        distance: 2,
      },
      true,
    );

    expect(position.x).toBeCloseTo(direction.x * 2);
    expect(position.y).toBeCloseTo(2);
    expect(position.z).toBeCloseTo(direction.z * 2);
  });

  it("can omit generator height", () => {
    const position = createRadialPosition(
      {
        normalizedRatio: createTestRatio(15n, 8n),
        path: [
          { prime: 3n, direction: 1 },
          { prime: 5n, direction: 1 },
        ],
        distance: 2,
      },
      false,
    );

    expect(position.y).toBe(0);
  });
});
