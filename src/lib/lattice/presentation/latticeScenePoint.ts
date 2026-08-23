import type { Ratio } from "../../ji/ratio";
import type { Vector3 } from "../geometry/vector";

export type LatticeScenePoint = Readonly<{
  id: string;
  rawInput: string;
  ratio: Ratio;
  labelRatio: Ratio;
  position: Vector3;
  hasHigherPrimeFactors: boolean;
  radialSide: "upper" | "lower" | null;
}>;
