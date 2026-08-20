import { createUnisonRatio } from "../../ji/createUnisonRatio";
import { createLatticeRatio } from "./createLatticeRatio";
import type { LatticeRatio } from "./latticeRatio";

export function createInitialLatticeRatio(id: string): readonly LatticeRatio[] {
  return [createLatticeRatio(id, "1/1", createUnisonRatio())];
}
