import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";
import type { Vector3 } from "./createRadialDirectionVector";
import { addVectors } from "./vector";

export type PrimeAnchorVectorResolver = (step: PrimeFactorStep) => Vector3;

export function createAnchorPositionsFromPrimePath(
  path: readonly PrimeFactorStep[],
  initialPosition: Vector3,
  resolveAnchorVector: PrimeAnchorVectorResolver,
): readonly Vector3[] {
  const positions: Vector3[] = [];
  let position = initialPosition;

  for (const step of path) {
    position = addVectors(position, resolveAnchorVector(step));

    positions.push(position);
  }

  return positions;
}
