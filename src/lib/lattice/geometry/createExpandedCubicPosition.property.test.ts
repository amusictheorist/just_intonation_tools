import { describe, expect, it } from "vitest";
import fc from "fast-check";
import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";
import { createExpandedCubicPosition } from "./createExpandedCubicPosition";

const coordinateArbitrary = fc.integer({ min: -100, max: 100 });

const vectorArbitrary = fc.record({
  x: coordinateArbitrary,
  y: coordinateArbitrary,
  z: coordinateArbitrary,
});

const cubicAddressArbitrary = fc.record({
  anchorPath: fc.constant([]),
  coordinates357: vectorArbitrary,
}) satisfies fc.Arbitrary<ExpandedCubicAddress>;

const anchorPath = [
  { prime: 11n, direction: 1 as const },
  { prime: 13n, direction: 1 as const },
];

function resolveAnchorVector(step: { prime: bigint; direction: 1 | -1 }) {
  if (step.prime === 11n) {
    return { x: 3, y: -2, z: 5 };
  }

  return { x: -4, y: 6, z: 1 };
}

describe("createExpandedCubicPosition properties", () => {
  it("preserves translations of the initial position", () => {
    fc.assert(
      fc.property(
        cubicAddressArbitrary,
        vectorArbitrary,
        vectorArbitrary,
        (address, initialPosition, translation) => {
          const translatedInitialPosition = {
            x: initialPosition.x + translation.x,
            y: initialPosition.y + translation.y,
            z: initialPosition.z + translation.z,
          };

          const position = createExpandedCubicPosition(
            address,
            initialPosition,
          );

          const translatedPosition = createExpandedCubicPosition(
            address,
            translatedInitialPosition,
          );

          expect(translatedPosition).toEqual({
            x: position.x + translation.x,
            y: position.y + translation.y,
            z: position.z + translation.z,
          });
        },
      ),
    );
  });

  it("preserves local cubic displacement within the same higher-prime lattice", () => {
    fc.assert(
      fc.property(
        vectorArbitrary,
        vectorArbitrary,
        vectorArbitrary,
        (anchorPosition, firstCoordinates, secondCoordinates) => {
          const firstAddress: ExpandedCubicAddress = {
            anchorPath,
            coordinates357: firstCoordinates,
          };

          const secondAddress: ExpandedCubicAddress = {
            anchorPath,
            coordinates357: secondCoordinates,
          };

          const firstPosition = createExpandedCubicPosition(
            firstAddress,
            anchorPosition,
            resolveAnchorVector,
          );

          const secondPosition = createExpandedCubicPosition(
            secondAddress,
            anchorPosition,
            resolveAnchorVector,
          );

          expect({
            x: secondPosition.x - firstPosition.x,
            y: secondPosition.y - firstPosition.y,
            z: secondPosition.z - firstPosition.z,
          }).toEqual({
            x: secondCoordinates.x - firstCoordinates.x,
            y: secondCoordinates.y - firstCoordinates.y,
            z: secondCoordinates.z - firstCoordinates.z,
          });
        },
      ),
    );
  });
});
