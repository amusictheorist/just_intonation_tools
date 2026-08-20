import type { RadialAddress } from "../symbolic/createRadialAddress";
import { calculateRadialRatioAngle } from "./calculateRadialRatioAngle";
import {
  createRadialDirectionVector,
  type Vector3,
} from "./createRadialDirectionVector";

/**
 * Converts a symbolic radial address into a Cartesian position.
 *
 * The octave-normalized ratio determines a single angluar direction in the radial plane. Generator distance determines how far the ratio lies from the origin along that direction.
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
  const angle = calculateRadialRatioAngle(address.normalizedRatio);
  const direction = createRadialDirectionVector(angle);

  return {
    x: direction.x * address.distance,
    y: includesGeneratorHeight ? address.distance : 0,
    z: direction.z * address.distance,
  };
}
