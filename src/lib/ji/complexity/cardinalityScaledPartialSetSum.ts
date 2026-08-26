import { canonicalPartialSetSum } from "./canonicalPartialSetSum";
import { createPositiveInteger } from "../integer/positiveInteger";
import type { PartialSet } from "../set/partialSet";
import { createRatio, type Ratio } from "../ratio/ratio";

/**
 * Scales the sum of a partial set's canonical representative by the sum of the first k positive integers, where k is the set's cardinality.
 *
 * this quantity is cardinality scaled Parspace Spectral Extension (#SpecExt_p).
 */

export function cardinalityScaledPartialSetSum(partialSet: PartialSet): Ratio {
  const sum = canonicalPartialSetSum(partialSet);
  const cardinality = BigInt(partialSet.members.length);
  const scale = (cardinality * (cardinality + 1n)) / 2n;

  return createRatio(createPositiveInteger(sum), createPositiveInteger(scale));
}
