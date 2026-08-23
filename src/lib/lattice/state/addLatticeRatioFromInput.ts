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

/**
 * Parses and adds a raw lattice ratio input.
 *
 * @param ratios The current lattice ratios.
 * @param id The identifier to assign if the input creates a new ratio.
 * @param rawInput The raw ratio string to parse and add.
 * @returns An added, duplicate, or invalid result with the resulting lattice ratio state and any relevant duplicate or validation information.
 */

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
