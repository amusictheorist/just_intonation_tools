import type { CubicCoordinates } from "../../symbolic/cubicCoordinates";

export function findCubicConnectionPrime(
  first: CubicCoordinates,
  second: CubicCoordinates,
): bigint | null {
  if (first.x !== second.x && first.y === second.y && first.z === second.z)
    return 3n;
  if (first.x === second.x && first.y !== second.y && first.z === second.z)
    return 5n;
  if (first.x === second.x && first.y === second.y && first.z !== second.z)
    return 7n;

  return null;
}
