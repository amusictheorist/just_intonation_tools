import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";
import { isExpandedCubicHigherPrimeConnectionVisible } from "./isExpandedCubicHigherPrimeConnectionVisible";
import { isExpandedCubicLocalConnectionVisible } from "./isExpandedCubicLocalConnectionVisible";
import type { LatticeConnection } from "./latticeConnection";

export type ExpandedCubicConnectionPoint = Readonly<{
  id: string;
  address: ExpandedCubicAddress;
}>;

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

      const higherPrimeConnectionVisible =
        isExpandedCubicHigherPrimeConnectionVisible(
          first.address,
          second.address,
          others,
        );

      if (!localConnectionVisible && !higherPrimeConnectionVisible) continue;

      connections.push({ fromId: first.id, toId: second.id });
    }
  }

  return connections;
}
