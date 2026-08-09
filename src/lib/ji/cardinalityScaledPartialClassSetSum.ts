import { canonicalPartialClassSetSum } from "./canonicalPartialClassSetSum";
import type { PartialClassSet } from "./partialClassSet";
import { createPositiveInteger } from "./positiveInteger";
import { createRatio, type Ratio } from "./ratio";

export function cardinalityScaledPartialClassSetSum(
  partialClassSet: PartialClassSet,
): Ratio {
  const sum = canonicalPartialClassSetSum(partialClassSet);
  const cardinality = BigInt(partialClassSet.members.length);
  const scale = cardinality * cardinality;

  return createRatio(createPositiveInteger(sum), createPositiveInteger(scale));
}
