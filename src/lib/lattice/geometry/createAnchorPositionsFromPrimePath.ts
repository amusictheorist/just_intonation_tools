import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";
import { addVectors, type Vector3 } from "./vector";

export type PrimeAnchorVectorResolver = (step: PrimeFactorStep) => Vector3;

/**
 * Resolves the successive higher-prime anchor positions along a canonical prime-factor path.
 *
 * Each prime-factor step is converted to a signed global anchor vector and added to the position reached by the preceding step. This additive model preserves a shared global orientation for every higher prime: repeated factors continue along the same axis, while combinations of distinct primes form vector-sum relationships such as parallelograms.
 *
 * The returned array contains one position for each path step and does not include the supplied initial position.
 *
 * @param path The canonical prime-factor path.
 * @param initialPosition The starting position from which the path is resolved.
 * @param resolveAnchorVector Resolves each prime step to its signed global anchor vector.
 * @returns One accumulated position for each path step, in path order. The initial position itself is not included.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

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
