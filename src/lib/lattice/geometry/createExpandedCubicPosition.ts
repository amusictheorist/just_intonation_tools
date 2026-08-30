import type { CubicRotation } from "../state/latticeGeometry";
import type { ExpandedCubicAddress } from "../symbolic/cubic/createExpandedCubicAddress";
import { createAnchorPositionFromPrimePath } from "./createAnchorPositionFromPrimePath";
import type { PrimeAnchorVectorResolver } from "./createAnchorPositionsFromPrimePath";
import type { Vector3 } from "./vector";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";
import { rotateVector } from "./rotateVector";
import { addVectors } from "./vector";

/**
 * Resolves an expanded-cubic address to a geometric position.
 *
 * Higher-prime factors determine the translated anchor position, while the local 3-5-7 coordinates are added directly in the shared global cubic orientation. Local cubic axes remain parallel to the global 3-5-7 axes at every higher-prime anchor.
 *
 * @param address The symbolic expanded-cubic address to resolve.
 * @param initialPosition The origin from which the higher-prime anchor path is resolved.
 * @param higherPrimeRotation The Euler rotation applied to the local 3-5-7 coordinates.
 * @param resolveAnchorVector Resolves each higher-prime step to its signed global anchor vector.
 * @returns The final geometric position for the expanded-cubic address.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createExpandedCubicPosition(
  address: ExpandedCubicAddress,
  initialPosition: Vector3,
  higherPrimeRotation: CubicRotation,
  resolveAnchorVector: PrimeAnchorVectorResolver = resolvePrimeAnchorVector,
): Vector3 {
  const anchorPosition = createAnchorPositionFromPrimePath(
    address.anchorPath,
    initialPosition,
    resolveAnchorVector,
  );

  if (address.anchorPath.length === 0)
    return addVectors(anchorPosition, address.coordinates357);

  const unrotatedPosition = addVectors(anchorPosition, address.coordinates357);

  return rotateVector(unrotatedPosition, higherPrimeRotation);
}
