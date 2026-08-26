import { describe, expect, it } from "vitest";
import fc from "fast-check";
import type { ExpandedCubicAddress } from "../symbolic/cubic/createExpandedCubicAddress";
import { createExpandedCubicPosition } from "./createExpandedCubicPosition";
import { resolveTestPrimeAnchorVector } from "./test/resolveTestPrimeAnchorVector";
import { DEFAULT_CUBIC_LOCAL_ROTATION } from "./latticeGeometryConstants";
import { vectorArbitrary } from "./test/vectorArbitrary";

const cubicAddressArbitrary = fc.record({
  anchorPath: fc.constant([]),
  coordinates357: vectorArbitrary,
}) satisfies fc.Arbitrary<ExpandedCubicAddress>;

const anchorPath = [
  { prime: 11n, direction: 1 as const },
  { prime: 13n, direction: 1 as const },
];

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
            DEFAULT_CUBIC_LOCAL_ROTATION,
          );

          const translatedPosition = createExpandedCubicPosition(
            address,
            translatedInitialPosition,
            DEFAULT_CUBIC_LOCAL_ROTATION,
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
            DEFAULT_CUBIC_LOCAL_ROTATION,
            resolveTestPrimeAnchorVector,
          );

          const secondPosition = createExpandedCubicPosition(
            secondAddress,
            anchorPosition,
            DEFAULT_CUBIC_LOCAL_ROTATION,
            resolveTestPrimeAnchorVector,
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
