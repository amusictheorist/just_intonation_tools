import type { LowerRadialSymmetry } from "../state/latticeGeometry";
import type { ExpandedRadialAddress } from "../symbolic/createExpandedRadialAddress";
import { type Vector3 } from "./createRadialDirectionVector";
import { createRadialPosition } from "./createRadialPosition";

/**
 * Converts an expanded radial address into a Cartesian position.
 *
 * Upper-side addresses use ordinary signed radial placement unchanged.
 *
 * Lower-side addresses are placed below the origin. In `aligned` mode, the horizontal vector is inverted so that a lower-sode ratio aligns tiwh its corresponding upper-side inverse. In `continuous` mode, the signed horizontal vector is preserved, placing the lower-side ratio 180 degrees aroung the origin from its aligned position.
 *
 * Generator-height handling is delegated to ordinary radial placement, so flattened placement remains available through the same option..
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
  const position = createRadialPosition(address, includeGeneratorHeight);

  if (address.side !== "lower") return position;

  if (lowerSymmetry === "aligned") {
    return {
      x: -position.x,
      y: -position.y,
      z: -position.z,
    };
  }

  return {
    x: position.x,
    y: -position.y,
    z: position.z,
  };
}
