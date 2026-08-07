import { createPartialClassSet, type PartialClassSet } from "./partialClassSet";
import type { PartialSet } from "./partialSet";
import { partialToPartialClass } from "./partialToPartialClass";

/**
 * Derive the partial-class set associated with a validated partial set.
 *
 * Each partial is converted to its octave-equivalent partial class. Duplicate partial classes are removed and the result is exposed in ascending order by `createPartialClassSet`.
 *
 * @param partialSet A validated partial set.
 * @returns The corresponding immutable partial-class set.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function partialSetToPartialClassSet(
  partialSet: PartialSet,
): PartialClassSet {
  return createPartialClassSet(partialSet.members.map(partialToPartialClass));
}
