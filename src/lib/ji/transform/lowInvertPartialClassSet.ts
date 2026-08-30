import { leastCommonMultiple } from "../integer/leastCommonMultiple";
import type { PositiveInteger } from "../integer/positiveInteger";
import { createPartialClass } from "../partial/partialClass";
import {
  createPartialClassSet,
  type PartialClassSet,
} from "../set/partialClassSet";

/**
 * Returns the low inverse of a validated partial-class set.
 *
 * The least common multiple of the set is divided by each member, and the results are returned as a normalized immutable partial-class set.
 *
 * @param partialClassSet The validated partial-class set to inver.
 * @returns The low inverse of the partial-class set.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function lowInvertPartialClassSet(
  partialClassSet: PartialClassSet,
): PartialClassSet {
  let commonMultiple: PositiveInteger = partialClassSet.members[0];

  for (const member of partialClassSet.members.slice(1)) {
    commonMultiple = leastCommonMultiple(commonMultiple, member);
  }

  return createPartialClassSet(
    partialClassSet.members.map((member) =>
      createPartialClass(commonMultiple / member),
    ),
  );
}
