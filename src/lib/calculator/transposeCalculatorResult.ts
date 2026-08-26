import type { PositiveInteger } from "../ji/integer/positiveInteger";
import type { PartialSet } from "../ji/set/partialSet";
import { partialSetToPartialClassSet } from "../ji/set/partialSetToPartialClassSet";
import { transposePartialSet } from "../ji/transform/transposePartialSet";
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
