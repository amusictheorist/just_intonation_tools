import { describe, expect, it } from "vitest";
import { createAnchorPositionFromPrimePath } from "./createAnchorPositionFromPrimePath";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";
import { testPrimeAnchorVectorResolver } from "./test/primeAnchorVectorResolver";

const initialPosition = { x: 0, y: 0, z: 0 };

describe("createAnchorPositionFromPrimePath", () => {
  it("returns the final position produced by the prime-factor path", () => {
    const position = createAnchorPositionFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
      ],
      initialPosition,
      testPrimeAnchorVectorResolver,
    );

    expect(position).toEqual({
      x: 2,
      y: 3,
      z: 0,
    });
  });

  it("applies an inverse prime step to the final position", () => {
    const position = createAnchorPositionFromPrimePath(
      [{ prime: 11n, direction: -1 }],
      initialPosition,
      testPrimeAnchorVectorResolver,
    );

    expect(position).toEqual({
      x: -2,
      y: 0,
      z: 0,
    });
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
    expect(
      createAnchorPositionFromPrimePath(
        [],
        initialPosition,
        testPrimeAnchorVectorResolver,
      ),
    ).toEqual(initialPosition);
  });
});
