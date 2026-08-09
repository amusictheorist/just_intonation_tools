import { leastCommonMultiple } from "./leastCommonMultiple";
import { createPartial } from "./partial";
import { createPartialSet, type PartialSet } from "./partialSet";
import type { PositiveInteger } from "./positiveInteger";

/**
 * Returns the low inverse of a validated partial set.
 *
 * The least common multiple of the set is divided by each member, and the results are returned as a normalized immutable partial set.
 *
 * @param partialSet The validated partial set to invert.
 * @returns The low inverse of the partial set.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function lowInvertPartialSet(partialSet: PartialSet): PartialSet {
  let commonMultiple: PositiveInteger = partialSet.members[0];

  for (const member of partialSet.members.slice(1)) {
    commonMultiple = leastCommonMultiple(commonMultiple, member);
  }

  return createPartialSet(
    partialSet.members.map((member) => createPartial(commonMultiple / member)),
  );
}
