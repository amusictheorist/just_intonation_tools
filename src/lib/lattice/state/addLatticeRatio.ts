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
