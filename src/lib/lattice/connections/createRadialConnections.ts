import { isPrimeAxisConnectionVisible } from "./isPrimeAxisConnectionVisible";
import type { LatticeConnection } from "./latticeConnection";

export type RadialConnectionPoint = Readonly<{
  id: string;
  exponents: ReadonlyMap<bigint, number>;
}>;

export function createRadialConnections(
  points: readonly RadialConnectionPoint[],
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

      const otherExponents = points
        .filter((_, index) => index !== firstIndex && index !== secondIndex)
        .map((point) => point.exponents);

      if (
        !isPrimeAxisConnectionVisible(
          first.exponents,
          second.exponents,
          otherExponents,
        )
      )
        continue;

      connections.push({ fromId: first.id, toId: second.id });
    }
  }

  return connections;
}
