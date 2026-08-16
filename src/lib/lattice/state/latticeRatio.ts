import type { Ratio } from "../../ji/ratio";

export type LatticeRatio = Readonly<{
  id: string;
  rawInput: string;
  ratio: Ratio;
}>;
