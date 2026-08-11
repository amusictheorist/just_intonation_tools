import type { PartialSet } from "../ji/partialSet";
import { partialSetToPartialClassSet } from "../ji/partialSetToPartialClassSet";
import type { PositiveInteger } from "../ji/positiveInteger";
import { transposePartialSet } from "../ji/transposePartialSet";
import type { TransposedCalculatorResult } from "./types";

export function transposeCalculatorResult(
  partialSet: PartialSet,
  transpositionFactor: PositiveInteger,
): TransposedCalculatorResult {
  const transposedSet = transposePartialSet(partialSet, transpositionFactor);

  return {
    partialSet: transposedSet,
    partialClassSet: partialSetToPartialClassSet(transposedSet),
  };
}
