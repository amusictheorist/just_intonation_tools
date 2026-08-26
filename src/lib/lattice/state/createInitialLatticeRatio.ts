import { createUnisonRatio } from "../../ji/ratio/createUnisonRatio";
import { createLatticeRatio } from "./createLatticeRatio";
import type { LatticeRatio } from "./latticeRatio";

/**
 * Creates the initial lattice-ratio state containing unison.
 *
 * @param id The identifier assigned to the initial 1/1 ratio.
 * @returns A lattice-ratio collection containing only unison.
 */

export function createInitialLatticeRatio(id: string): readonly LatticeRatio[] {
  return [createLatticeRatio(id, "1/1", createUnisonRatio())];
}
