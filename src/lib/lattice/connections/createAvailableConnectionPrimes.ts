import { comparePrimesAscending } from "../symbolic/comparePrimesAscending";
import type { LatticeConnection } from "./latticeConnection";

export function createAvailableConnectionPrimes(
  connections: readonly LatticeConnection[],
): readonly bigint[] {
  return [...new Set(connections.map((connection) => connection.prime))].sort(
    comparePrimesAscending,
  );
}
