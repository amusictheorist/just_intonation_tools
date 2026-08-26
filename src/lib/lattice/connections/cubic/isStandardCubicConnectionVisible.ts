import type { CubicCoordinates } from "../../symbolic/cubicCoordinates";
import { areStandardCubicPointsAxisAligned } from "./areStandardCubicPointsAxisAligned";

export function isStandardCubicConnectionVisible(
  first: CubicCoordinates,
  second: CubicCoordinates,
  others: readonly CubicCoordinates[],
): boolean {
  if (!areStandardCubicPointsAxisAligned(first, second)) return false;

  return !others.some((other) =>
    liesBetweenOnSameCubicAxis(first, second, other),
  );
}

function liesBetweenOnSameCubicAxis(
  first: CubicCoordinates,
  second: CubicCoordinates,
  other: CubicCoordinates,
): boolean {
  if (first.y === second.y && first.z === second.z) {
    return (
      other.y === first.y &&
      other.z === first.z &&
      other.x > Math.min(first.x, second.x) &&
      other.x < Math.max(first.x, second.x)
    );
  }

  if (first.x === second.x && first.z === second.z) {
    return (
      other.x === first.x &&
      other.z === first.z &&
      other.y > Math.min(first.y, second.y) &&
      other.y < Math.max(first.y, second.y)
    );
  }

  return (
    other.x === first.x &&
    other.y === first.y &&
    other.z > Math.min(first.z, second.z) &&
    other.z < Math.max(first.z, second.z)
  );
}
