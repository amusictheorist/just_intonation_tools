import { inverRatio } from "../../ji/invertRatio";
import type { LowerRadialSymmetry } from "../state/latticeGeometry";
import type { ExpandedRadialAddress } from "../symbolic/createExpandedRadialAddress";
import { calculateRadialRatioAngle } from "./calculateRadialRatioAngle";
import {
  createRadialDirectionVector,
  type Vector3,
} from "./createRadialDirectionVector";

/**
 * Converts an expanded radial address into a Cartesian position.
 *
 * Upper-side and lower-side ratios share the same base angular position.
 * Lower-side ratios are placed below the origin, and continuous mode adds a 180-degree twist to their horizontal direction.
 *
 * Generator distance determines horizontal radius and, when enabled, vertical height.
 *
 * @param address The symbolic expanded radial address to place.
 * @param includeGeneratorHeight Whether generator distance contributes to y.
 * @param lowerSymmetry The angular relationship between upper and lower sides.
 * @returns The Cartesian expanded-radial position.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */
export function createExpandedRadialPosition(
  address: ExpandedRadialAddress,
  includeGeneratorHeight: boolean,
  lowerSymmetry: LowerRadialSymmetry,
): Vector3 {
  const angularRatio =
    address.side === "lower"
      ? inverRatio(address.normalizedRatio)
      : address.normalizedRatio;

  let angle = calculateRadialRatioAngle(angularRatio);

  if (address.side === "lower" && lowerSymmetry === "continuous") angle += 180;

  const direction = createRadialDirectionVector(angle);
  const height = includeGeneratorHeight ? address.distance : 0;

  return {
    x: direction.x * address.distance,
    y: address.side === "lower" ? -height : height,
    z: direction.z * address.distance,
  };
}
