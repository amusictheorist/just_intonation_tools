import type { LatticeRatio } from "./latticeRatio";

export function removeLastLatticeRatioById(
  ratios: readonly LatticeRatio[],
  id: string,
): readonly LatticeRatio[] {
  return ratios.filter((ratio) => ratio.id !== id);
}
