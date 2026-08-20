import type { RadialAddress } from "../symbolic/createRadialAddress";
import { calculateRadialPrimeAngle } from "./calculateRadialPrimeAngle";
import {
  createRadialDirectionVector,
  type Vector3,
} from "./createRadialDirectionVector";

/**
 * Converts a symbolic radial address into a Cartesian position.
 *
 * Each prime factor contributes its canonical radial direction vector. Positive prime-factor steps add that vector, while nefative steps subtract it. Repeated factors therefore extend along the same straight line, and composite ratios are positioned by vector addition.
 *
 * When generator height is enabled, the y-coordinate equls the address's generator distance; otherwise the position is flattened to y = 0.
 *
 * @param address The symbolic radial address to place.
 * @param includesGeneratorHeight Whether to use generator distance as the vertical coordinate.
 * @returns The Cartesian radial position.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createRadialPosition(
  address: RadialAddress,
  includesGeneratorHeight: boolean,
): Vector3 {
  let x = 0;
  let z = 0;

  for (const step of address.path) {
    const angle = calculateRadialPrimeAngle({
      prime: step.prime,
      direction: 1,
    });
    const direction = createRadialDirectionVector(angle);

    x += direction.x * step.direction;
    z += direction.z * step.direction;
  }

  return {
    x,
    y: includesGeneratorHeight ? address.distance : 0,
    z,
  };
}
