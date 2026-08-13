import type { RadialAddress } from "../symbolic/createRadialAddress";
import { calculateRadialPrimeAngle } from "./calculateRadialPrimeAngle";
import {
  createRadialDirectionVector,
  type Vector3,
} from "./createRadialDirectionVector";

/**
 * Converts a symbolic radial address into a Cartesian position.
 *
 * Each prime-factor step contributes one unit direction vector in the x-y-z plane. Those vectors are summed to determine horizontal placement.
 * When generator height is enabled, the y-coordinate equals the address's generator distance; otherwise the position is flattened to y = 0.
 *
 * @param address The sy7mbolic radial address to place.
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
    const angle = calculateRadialPrimeAngle(step);
    const direction = createRadialDirectionVector(angle);

    x += direction.x;
    z += direction.z;
  }

  return { x, y: includesGeneratorHeight ? address.distance : 0, z };
}
