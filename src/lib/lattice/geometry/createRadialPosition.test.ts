import { describe, expect, it } from "vitest";
import { createRadialPosition } from "./createRadialPosition";
import { createRadialDirectionVector } from "./createRadialDirectionVector";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createUnisonRatio } from "../../ji/ratio/createUnisonRatio";
import { calculateRadialPrimeAngle } from "./calculateRadialPrimeAngle";

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

  it("places a single prime factor along its canonical radial direction", () => {
    const angle = calculateRadialPrimeAngle({ prime: 3n, direction: 1 });
    const direction = createRadialDirectionVector(angle);

    const position = createRadialPosition(
      {
        normalizedRatio: createTestRatio(3n, 2n),
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
      true,
    );

    expect(position.x).toBeCloseTo(direction.x);
    expect(position.y).toBeCloseTo(1);
    expect(position.z).toBeCloseTo(direction.z);
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

  it("places repeated powers of a prime along the same radial line", () => {
    const primeAddress = {
      normalizedRatio: createTestRatio(3n, 2n),
      path: [{ prime: 3n, direction: 1 as const }],
      distance: 1,
    };

    const powerAddress = {
      normalizedRatio: createTestRatio(9n, 8n),
      path: [
        { prime: 3n, direction: 1 as const },
        { prime: 3n, direction: 1 as const },
      ],
      distance: 2,
    };

    const primePosition = createRadialPosition(primeAddress, true);
    const powerPosition = createRadialPosition(powerAddress, true);

    expect(powerPosition.x).toBeCloseTo(primePosition.x * 2);
    expect(powerPosition.y).toBeCloseTo(2);
    expect(powerPosition.z).toBeCloseTo(primePosition.z * 2);
  });

  it("adds prime vectors for composite ratios", () => {
    const threePosition = createRadialPosition(
      {
        normalizedRatio: createTestRatio(3n, 2n),
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
      false,
    );

    const fivePosition = createRadialPosition(
      {
        normalizedRatio: createTestRatio(5n, 4n),
        path: [{ prime: 5n, direction: 1 }],
        distance: 1,
      },
      false,
    );

    const compositePosition = createRadialPosition(
      {
        normalizedRatio: createTestRatio(15n, 8n),
        path: [
          { prime: 3n, direction: 1 },
          { prime: 5n, direction: 1 },
        ],
        distance: 2,
      },
      true,
    );

    expect(compositePosition.x).toBeCloseTo(threePosition.x + fivePosition.x);
    expect(compositePosition.y).toBeCloseTo(2);
    expect(compositePosition.z).toBeCloseTo(threePosition.z + fivePosition.z);
  });

  it("subtracts prime vectors for negative prime-factor steps", () => {
    const positivePosition = createRadialPosition(
      {
        normalizedRatio: createTestRatio(3n, 2n),
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
      false,
    );

    const negativePosition = createRadialPosition(
      {
        normalizedRatio: createTestRatio(2n, 3n),
        path: [{ prime: 3n, direction: -1 }],
        distance: 1,
      },
      false,
    );

    expect(negativePosition.x).toBeCloseTo(-positivePosition.x);
    expect(negativePosition.z).toBeCloseTo(-positivePosition.z);
  });
});
