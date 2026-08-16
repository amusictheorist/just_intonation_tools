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
