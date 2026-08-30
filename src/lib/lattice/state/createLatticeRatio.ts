import type { Ratio } from "../../ji/ratio/ratio";
import type { LatticeRatio } from "./latticeRatio";

/**
 * Creates a lattice ratio record from an existing exact ratio.
 *
 * @param id The stable identifier for the lattice ratio.
 * @param rawInput The original user-entered ratio string.
 * @param ratio The validated exact ratio represented by the input.
 * @returns The lattice ratio record.
 */

export function createLatticeRatio(
  id: string,
  rawInput: string,
  ratio: Ratio,
): LatticeRatio {
  return {
    id,
    rawInput,
    ratio,
  };
}
