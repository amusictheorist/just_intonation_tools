import { canonicalizePartialClassSet } from "../ji/canonicalizePartialClassSet";
import { canonicalizePartialSet } from "../ji/canonicalizePartialSet";
import { lowInvertPartialClassSet } from "../ji/lowInvertPartialClassSet";
import { lowInvertPartialSet } from "../ji/lowInvertPartialSet";
import type { PartialSet } from "../ji/partialSet";
import { partialSetToPartialClassSet } from "../ji/partialSetToPartialClassSet";
import type { CalculatorResult } from "./types";

export function buildCalculatorResult(
  partialSet: PartialSet,
): CalculatorResult {
  const partialClassSet = partialSetToPartialClassSet(partialSet);
  const partialSetLowInverse = lowInvertPartialSet(partialSet);
  const partialClassSetLowInverse = lowInvertPartialClassSet(partialClassSet);

  return {
    partial: {
      set: partialSet,
      setClass: canonicalizePartialSet(partialSet),
      lowInverse: partialSetLowInverse,
      lowInverseSetClass: canonicalizePartialSet(partialSetLowInverse),
    },
    partialClass: {
      set: partialClassSet,
      setClass: canonicalizePartialClassSet(partialClassSet),
      lowInverse: partialClassSetLowInverse,
      lowInverseSetClass: canonicalizePartialClassSet(
        partialClassSetLowInverse,
      ),
    },
  };
}
