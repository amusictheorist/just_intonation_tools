import { canonicalizePartialClassSet } from "../ji/set/canonicalizePartialClassSet";
import { canonicalizePartialSet } from "../ji/set/canonicalizePartialSet";
import { lowInvertPartialClassSet } from "../ji/transform/lowInvertPartialClassSet";
import { lowInvertPartialSet } from "../ji/transform/lowInvertPartialSet";
import type { PartialSet } from "../ji/set/partialSet";
import { partialSetToPartialClassSet } from "../ji/set/partialSetToPartialClassSet";
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
