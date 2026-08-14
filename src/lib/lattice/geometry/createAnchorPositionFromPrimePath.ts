import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";
import {
  createAnchorPositionsFromPrimePath,
  type PrimeAnchorVectorResolver,
} from "./createAnchorPositionsFromPrimePath";
import type { Vector3 } from "./createRadialDirectionVector";

export function createAnchorPositionFromPrimePath(
  path: readonly PrimeFactorStep[],
  initialPosition: Vector3,
  resolveAnchorVector: PrimeAnchorVectorResolver,
): Vector3 {
  const positions = createAnchorPositionsFromPrimePath(
    path,
    initialPosition,
    resolveAnchorVector,
  );

  return positions.at(-1) ?? initialPosition;
}
