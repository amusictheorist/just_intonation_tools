import type { LatticeConnection } from "../latticeConnection";

export function canonicalizeConnection(connection: LatticeConnection): string {
  const ids = [connection.fromId, connection.toId].sort();

  return `${ids[0]}|${ids[1]}|${connection.prime}`;
}
