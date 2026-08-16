import { addLatticeRatio } from "./addLatticeRatio";
import { createLatticeRatioFromInput } from "./createLatticeRatioFromInput";
import type { LatticeRatio } from "./latticeRatio";

export type AddLatticeRatioFromInputResult =
  | Readonly<{
      status: "added";
      ratios: readonly LatticeRatio[];
    }>
  | Readonly<{
      status: "duplicate";
      ratios: readonly LatticeRatio[];
      existingRatio: LatticeRatio;
    }>
  | Readonly<{
      status: "invalid";
      ratios: readonly LatticeRatio[];
      error: string;
    }>;

export function addLatticeRatioFromInput(
  ratios: readonly LatticeRatio[],
  id: string,
  rawInput: string,
): AddLatticeRatioFromInputResult {
  const created = createLatticeRatioFromInput(id, rawInput);

  if (created.success === false) {
    return {
      status: "invalid",
      ratios,
      error: created.error,
    };
  }

  return addLatticeRatio(ratios, created.latticeRatio);
}
