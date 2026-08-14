import { describe, expect, it } from "vitest";
import { createAnchorPositionFromPrimePath } from "./createAnchorPositionFromPrimePath";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";

const initialPosition = { x: 0, y: 0, z: 0 };

function resolveAnchorVector(step: { prime: bigint; direction: 1 | -1 }) {
  if (step.prime === 11n) {
    return { x: 2, y: 0, z: 0 };
  }

  return { x: 0, y: 0, z: 3 };
}

describe("createAnchorPositionFromPrimePath", () => {
  it("returns the final position produced by the prime-factor path", () => {
    const position = createAnchorPositionFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
      ],
      initialPosition,
      resolveAnchorVector,
    );

    expect(position).toEqual({
      x: 2,
      y: 0,
      z: 3,
    });
  });

  it("applies an inverse prime step to the final position", () => {
    function resolveInverseAnchorVector(step: {
      prime: bigint;
      direction: 1 | -1;
    }) {
      const vector = { x: 2, y: 0, z: 0 };

      if (step.direction === -1) {
        return {
          x: -vector.x,
          y: -vector.y,
          z: -vector.z,
        };
      }

      return vector;
    }

    const position = createAnchorPositionFromPrimePath(
      [{ prime: 11n, direction: -1 }],
      initialPosition,
      resolveInverseAnchorVector,
    );

    expect(position.x).toBeCloseTo(-2);
    expect(position.y).toBeCloseTo(0);
    expect(position.z).toBeCloseTo(0);
  });

  it("creates the final position from signed steps using the canonical resolver", () => {
    const position = createAnchorPositionFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
      ],
      initialPosition,
      resolvePrimeAnchorVector,
    );

    expect(position).not.toEqual(initialPosition);
  });

  it("returns the initial position for an empty prime path", () => {
    function resolveAnchorVector() {
      return { x: 1, y: 0, z: 0 };
    }

    expect(
      createAnchorPositionFromPrimePath(
        [],
        initialPosition,
        resolveAnchorVector,
      ),
    ).toEqual(initialPosition);
  });
});
