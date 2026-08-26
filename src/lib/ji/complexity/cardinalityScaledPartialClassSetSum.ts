import { canonicalPartialClassSetSum } from "./canonicalPartialClassSetSum";
import { createPositiveInteger } from "../integer/positiveInteger";
import type { PartialClassSet } from "../set/partialClassSet";
import { createRatio, type Ratio } from "../ratio/ratio";

export function cardinalityScaledPartialClassSetSum(
  partialClassSet: PartialClassSet,
): Ratio {
  const sum = canonicalPartialClassSetSum(partialClassSet);
  const cardinality = BigInt(partialClassSet.members.length);
  const scale = cardinality * cardinality;

  return createRatio(createPositiveInteger(sum), createPositiveInteger(scale));
}
