import type { LatticeRatio } from "./latticeRatio";

export function removeLastLatticeRatio(
  ratios: readonly LatticeRatio[],
): readonly LatticeRatio[] {
  return ratios.slice(0, -1);
}
