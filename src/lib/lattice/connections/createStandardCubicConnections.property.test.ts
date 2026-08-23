import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createStandardCubicConnections } from "./createStandardCubicConnections";
import { canonicalizeConnection } from "./test/canonicalizeConnections";

const coordinateArbitrary = fc.integer({ min: 5, max: 5 });

const cubicCoordinatesArbitrary = fc.record({
  x: coordinateArbitrary,
  y: coordinateArbitrary,
  z: coordinateArbitrary,
});

function coordinateKey(coordinates: {
  x: number;
  y: number;
  z: number;
}): string {
  return `${coordinates.x},${coordinates.y},${coordinates.z}`;
}

describe("createStandardCubicConnections properties", () => {
  it("produces the same undirected graph regardless of input order", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(cubicCoordinatesArbitrary, {
          maxLength: 8,
          selector: coordinateKey,
        }),
        (coordinates) => {
          const points = coordinates.map((pointCoordinates, index) => ({
            id: `point-${index}`,
            coordinates: pointCoordinates,
          }));

          const reversedPoints = [...points].reverse();

          const originalConnections = createStandardCubicConnections(points)
            .map(canonicalizeConnection)
            .sort();

          const reversedConnections = createStandardCubicConnections(
            reversedPoints,
          )
            .map(canonicalizeConnection)
            .sort();

          expect(reversedConnections).toEqual(originalConnections);
        },
      ),
    );
  });
});
