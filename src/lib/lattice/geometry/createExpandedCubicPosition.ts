import type { ExpandedCubicAddress } from "../symbolic/createExpandedCubicAddress";
import { createAnchorPositionFromPrimePath } from "./createAnchorPositionFromPrimePath";
import type { PrimeAnchorVectorResolver } from "./createAnchorPositionsFromPrimePath";
import type { Vector3 } from "./createRadialDirectionVector";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";
import { addVectors } from "./vector";

/**
 * Resolves an expanded-cubic address to a geometric position.
 *
 * Higher-prime factors determine the translated anchor position, while the local 3-5-7 coordinates are added directly in the shared global cubic orientation. Local cubic axes there remain parallel to the global 3-5-7 axes at every higher-prime anchor.
 *
 * @param address The symbolic expanded-cubic address to resolve.
 * @param initialPosition The origin from which the higher-prime anchor path is resolved.
 * @param resolveAnchorVector Resolves each higher-prime step to its signed global anchor vector.
 * @returns The final geometric position for the expanded-cubic address.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createExpandedCubicPosition(
  address: ExpandedCubicAddress,
  initialPosition: Vector3,
  resolveAnchorVector: PrimeAnchorVectorResolver = resolvePrimeAnchorVector,
): Vector3 {
  const anchorPosition = createAnchorPositionFromPrimePath(
    address.anchorPath,
    initialPosition,
    resolveAnchorVector,
  );

  return addVectors(anchorPosition, address.coordinates357);
}
