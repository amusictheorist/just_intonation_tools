import { areRatiosEqual } from "../../ji/areRatiosEqual";
import type { LatticeRatio } from "./latticeRatio";

export type AddLatticeRatioResult =
  | Readonly<{
      status: "added";
      ratios: readonly LatticeRatio[];
    }>
  | Readonly<{
      status: "duplicate";
      ratios: readonly LatticeRatio[];
      existingRatio: LatticeRatio;
    }>;

/**
 * Adds a lattice ratio unless an equivalent ratio is already present.
 *
 * Duplicate detection uses exact ratio equality, so differently written inputs representing the same ratio are treated as the same lattice point.
 *
 * @param ratios The current lattice ratios.
 * @param latticeRatio The lattice ratio to add.
 * @returns An added result with the updated ratios, or a duplicate result with the unchanged ratios and existing equivalent ratio.
 */

export function addLatticeRatio(
  ratios: readonly LatticeRatio[],
  latticeRatio: LatticeRatio,
): AddLatticeRatioResult {
  const existingRatio = ratios.find((existing) =>
    areRatiosEqual(existing.ratio, latticeRatio.ratio),
  );

  if (existingRatio) {
    return {
      status: "duplicate",
      ratios,
      existingRatio,
    };
  }

  return {
    status: "added",
    ratios: [...ratios, latticeRatio],
  };
}
