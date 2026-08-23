import type { LatticeRatio } from "./latticeRatio";

/**
 * Removes the final ratio from a lattice-ratio collection.
 *
 * @param ratios The current lattice ratios.
 * @returns A new collection without the final ratio, or an empty collection when no ratios are present.
 */

export function removeLastLatticeRatio(
  ratios: readonly LatticeRatio[],
): readonly LatticeRatio[] {
  return ratios.slice(0, -1);
}
