import type { CubicCoordinates } from "../symbolic/cubicCoordinates";

export function areStandardCubicPointsAxisAligned(
  first: CubicCoordinates,
  second: CubicCoordinates,
): boolean {
  const differingCoordinates = [
    first.x !== second.x,
    first.y !== second.y,
    first.z !== second.z,
  ].filter(Boolean).length;

  return differingCoordinates === 1;
}
