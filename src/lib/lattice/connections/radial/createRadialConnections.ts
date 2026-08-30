import type { PrimeExponents } from "../../symbolic/primeExponents";
import { findDifferingPrime } from "../findDifferingPrime";
import { isPrimeAxisConnectionVisible } from "../isPrimeAxisConnectionVisible";
import type { LatticeConnection } from "../latticeConnection";

export type RadialConnectionPoint = Readonly<{
  id: string;
  exponents: PrimeExponents;
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

      const prime = findDifferingPrime(first.exponents, second.exponents);

      if (prime === null) continue;

      connections.push({ fromId: first.id, toId: second.id, prime });
    }
  }

  return connections;
}
