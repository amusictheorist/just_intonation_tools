import type { ExpandedRadialAddress } from "../symbolic/createExpandedRadialAddress";
import type { Vector3 } from "./createRadialDirectionVector";
import { createRadialPosition } from "./createRadialPosition";

/**
 * Selects how lower-side expanded radial positions are reflected.
 *
 * `continuous` reflects through the origin, preserving continuity around the radial path. `aligned` reflects only the vertical axis, keeping lower-side positions horizontally aligned with their upper-side counterparts.
 */

export type LowerRadialSymmetry = "continuous" | "aligned";

/**
 * Converts an expanded radial address into a Cartesian position.
 *
 * Upper-side addresses use ordinary radial placement unchanged.
 * Lower-side addresses apply the selected symmetry:
 *
 * - `"continuous"` negates x, y, and z;
 * - `"aligned"` negates only y.
 *
 * Generator-height handling is delegated to ordinary radial placement, so flattened placement remains available through the same option.
 *
 * @param address The symbolic expanded radial address to place.
 * @param includeGeneratorHeight Whether generator distance contributes to y.
 * @param lowerSymmetry The reflection rule for lower-side addresses.
 * @returns The Cartesian expanded radial position.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */
export function createExpandedRadialPosition(
  address: ExpandedRadialAddress,
  includeGeneratorHeight: boolean,
  lowerSymmetry: LowerRadialSymmetry,
): Vector3 {
  const position = createRadialPosition(address, includeGeneratorHeight);

  if (address.side === "lower" && lowerSymmetry === "continuous") {
    return {
      x: -position.x,
      y: -position.y,
      z: -position.z,
    };
  }

  if (address.side === "lower" && lowerSymmetry === "aligned") {
    return {
      x: position.x,
      y: -position.y,
      z: position.z,
    };
  }

  return position;
}
