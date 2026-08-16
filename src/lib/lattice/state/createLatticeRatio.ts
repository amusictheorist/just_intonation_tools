import type { Ratio } from "../../ji/ratio";
import type { LatticeRatio } from "./latticeRatio";

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
