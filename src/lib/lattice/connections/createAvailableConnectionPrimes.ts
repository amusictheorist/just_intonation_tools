import type { LatticeConnection } from "./latticeConnection";

export function createAvailableConnectionPrimes(
  connections: readonly LatticeConnection[],
): readonly bigint[] {
  return [...new Set(connections.map((connection) => connection.prime))].sort(
    (first, second) => (first < second ? -1 : first > second ? 1 : 0),
  );
}
