import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";
import {
  createAnchorPositionsFromPrimePath,
  type PrimeAnchorVectorResolver,
} from "./createAnchorPositionsFromPrimePath";
import type { Vector3 } from "./vector";

/**
 * Resolves the final higher-prime anchor position reached by a canonical prime-factor path.
 *
 * Each step contributes a signed global anchor vector, so the resulting position is the sum of those displacements from the supplied initial position. Prime directions are therefore preserved globally rather than being rotated through successive local coordinate frames.
 *
 * @param path The canonical prime-factor path.
 * @param initialPosition The starting position from which the path is resolved.
 * @param resolveAnchorVector Resolves each prime step to its signed global anchor vector.
 * @returns The final position reached after applying every path step, or the initial position when the path is empty.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

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
