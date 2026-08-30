import type { LatticeConnection } from "./latticeConnection";

export type LatticeConnectionVisibility = Readonly<{
  showConnections: boolean;
  visiblePrimes: ReadonlySet<bigint> | null;
}>;

export function filterLatticeConnections(
  connections: readonly LatticeConnection[],
  visibility: LatticeConnectionVisibility,
): readonly LatticeConnection[] {
  if (!visibility.showConnections) return [];

  if (visibility.visiblePrimes === null) return connections;

  return connections.filter((connection) =>
    visibility.visiblePrimes?.has(connection.prime),
  );
}
