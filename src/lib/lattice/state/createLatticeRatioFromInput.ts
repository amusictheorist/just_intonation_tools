import { parseLatticeRatioInput } from "../input/parseLatticeRatioInput";
import { createLatticeRatio } from "./createLatticeRatio";
import type { LatticeRatio } from "./latticeRatio";

export type CreateLatticeRatioFromInputResult =
  | Readonly<{
      success: true;
      latticeRatio: LatticeRatio;
    }>
  | Readonly<{
      success: false;
      error: string;
    }>;

/**
 * Parses raw lattice input and creates a lattice ratio when valid.
 *
 * @param id The identifier to assign a successfully create lattice ratio.
 * @param rawInput The raw ratio string to parse.
 * @returns A success result containing the lattice ratio, or a failure result containing the parse error.
 */

export function createLatticeRatioFromInput(
  id: string,
  rawInput: string,
): CreateLatticeRatioFromInputResult {
  const parsed = parseLatticeRatioInput(rawInput);

  if (parsed.success === false) {
    return {
      success: false,
      error: parsed.error,
    };
  }

  return {
    success: true,
    latticeRatio: createLatticeRatio(id, rawInput, parsed.ratio),
  };
}
