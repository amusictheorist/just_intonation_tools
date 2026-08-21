import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";
import { createHigherPrimeExponents } from "./createHigherPrimeExponents";
import { findDifferingPrime } from "./findDifferingPrime";
import { isExpandedCubicHigherPrimeConnectionVisible } from "./isExpandedCubicHigherPrimeConnectionVisible";
import { isExpandedCubicLocalConnectionVisible } from "./isExpandedCubicLocalConnectionVisible";
import type { LatticeConnection } from "./latticeConnection";

export type ExpandedCubicConnectionPoint = Readonly<{
  id: string;
  address: ExpandedCubicAddress;
}>;

function findLocalConnectionPrime(
  first: ExpandedCubicAddress,
  second: ExpandedCubicAddress,
): bigint | null {
  const firstCoorindates = first.coordinates357;
  const secondCoorindates = second.coordinates357;

  if (
    firstCoorindates.x !== secondCoorindates.x &&
    firstCoorindates.y === secondCoorindates.y &&
    firstCoorindates.z === secondCoorindates.z
  )
    return 3n;

  if (
    firstCoorindates.x === secondCoorindates.x &&
    firstCoorindates.y !== secondCoorindates.y &&
    firstCoorindates.z === secondCoorindates.z
  )
    return 5n;

  if (
    firstCoorindates.x === secondCoorindates.x &&
    firstCoorindates.y === secondCoorindates.y &&
    firstCoorindates.z !== secondCoorindates.z
  )
    return 7n;

  return null;
}

export function createExpandedCubicConnections(
  points: ExpandedCubicConnectionPoint[],
): readonly LatticeConnection[] {
  const connections: LatticeConnection[] = [];

  for (let firstIndex = 0; firstIndex < points.length; firstIndex++) {
    const first = points[firstIndex];

    for (
      let secondIndex = firstIndex + 1;
      secondIndex < points.length;
      secondIndex++
    ) {
      const second = points[secondIndex];

      const others = points
        .filter((_, index) => index !== firstIndex && index !== secondIndex)
        .map((point) => point.address);

      const localConnectionVisible = isExpandedCubicLocalConnectionVisible(
        first.address,
        second.address,
        others,
      );

      if (localConnectionVisible) {
        const prime = findLocalConnectionPrime(first.address, second.address);

        if (prime !== null) {
          connections.push({ fromId: first.id, toId: second.id, prime });
          continue;
        }
      }

      const higherPrimeConnectionVisible =
        isExpandedCubicHigherPrimeConnectionVisible(
          first.address,
          second.address,
          others,
        );

      if (!higherPrimeConnectionVisible) continue;

      const prime = findDifferingPrime(
        createHigherPrimeExponents(first.address),
        createHigherPrimeExponents(second.address),
      );

      if (prime === null) continue;

      connections.push({ fromId: first.id, toId: second.id, prime });
    }
  }

  return connections;
}
