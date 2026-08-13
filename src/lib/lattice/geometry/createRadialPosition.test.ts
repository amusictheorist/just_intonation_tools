import { describe, expect, it } from "vitest";
import { createRadialPosition } from "./createRadialPosition";
import { calculateRadialPrimeAngle } from "./calculateRadialPrimeAngle";
import { createRadialDirectionVector } from "./createRadialDirectionVector";

describe("createRadialPosition", () => {
  it("places an empty radial address at the origin", () => {
    expect(createRadialPosition({ path: [], distance: 0 }, true)).toEqual({
      x: 0,
      y: 0,
      z: 0,
    });
  });

  it("places one positive prime step at its radial direction and generator height", () => {
    const angle = calculateRadialPrimeAngle({ prime: 3n, direction: 1 });
    const direction = createRadialDirectionVector(angle);
    const position = createRadialPosition(
      {
        path: [{ prime: 3n, direction: 1 }],
        distance: 1,
      },
      true,
    );

    expect(position.x).toBeCloseTo(direction.x);
    expect(position.y).toBeCloseTo(1);
    expect(position.z).toBeCloseTo(direction.z);
  });

  it("sums radial directions across multiple prime-factor steps", () => {
    const steps = [
      { prime: 3n, direction: 1 as const },
      { prime: 5n, direction: -1 as const },
    ];

    const firstDirection = createRadialDirectionVector(
      calculateRadialPrimeAngle(steps[0]),
    );
    const secondDirection = createRadialDirectionVector(
      calculateRadialPrimeAngle(steps[1]),
    );

    const position = createRadialPosition({ path: steps, distance: 2 }, true);

    expect(position.x).toBeCloseTo(firstDirection.x + secondDirection.x);
    expect(position.y).toBeCloseTo(2);
    expect(position.z).toBeCloseTo(firstDirection.z + secondDirection.z);
  });

  it("can omit generator height", () => {
    const position = createRadialPosition(
      {
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
