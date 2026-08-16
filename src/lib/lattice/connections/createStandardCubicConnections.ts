import type { CubicCoordinates } from "../symbolic/cubicCoordinates";
import { isStandardCubicConnectionVisible } from "./isStandardCubicConnectionVisible";
import type { LatticeConnection } from "./latticeConnection";

export type StandardCubicConnectionPoint = Readonly<{
  id: string;
  coordinates: CubicCoordinates;
}>;

export function createStandardCubicConnections(
  points: readonly StandardCubicConnectionPoint[],
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
        .map((point) => point.coordinates);

      if (
        !isStandardCubicConnectionVisible(
          first.coordinates,
          second.coordinates,
          others,
        )
      )
        continue;

      connections.push({ fromId: first.id, toId: second.id });
    }
  }
  return connections;
}
