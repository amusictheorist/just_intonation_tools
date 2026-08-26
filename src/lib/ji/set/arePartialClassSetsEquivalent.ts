import { canonicalizePartialClassSet } from "./canonicalizePartialClassSet";
import type { PartialClassSet } from "./partialClassSet";

/**
 * Determine whether two validated partial-class sets belong to the same partial-class-set class.
 *
 * Two partial-class sets are equivalent when their canonical representatives are equal.
 *
 * @param left The first validated partial-class set.
 * @param right The second validated partial-class set.
 * @returns `true` when both sets have the same canonical representative.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function arePartialClassSetsEquivalent(
  left: PartialClassSet,
  right: PartialClassSet,
): boolean {
  const canonicalLeft = canonicalizePartialClassSet(left);
  const canonicalRight = canonicalizePartialClassSet(right);

  return (
    canonicalLeft.members.length === canonicalRight.members.length &&
    canonicalLeft.members.every(
      (member, index) => member === canonicalRight.members[index],
    )
  );
}
