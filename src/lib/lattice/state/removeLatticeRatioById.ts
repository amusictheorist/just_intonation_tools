import type { LatticeRatio } from "./latticeRatio";

/**
 * Removes lattice ratios with the specified identifier.
 *
 * @param ratios The current lattice ratios.
 * @param id The identifier of the lattice ratio to remove.
 * @returns A new collection containing only ratios whose identifiers do not match the cupplied ID.
 */

export function removeLatticeRatioById(
  ratios: readonly LatticeRatio[],
  id: string,
): readonly LatticeRatio[] {
  return ratios.filter((ratio) => ratio.id !== id);
}
