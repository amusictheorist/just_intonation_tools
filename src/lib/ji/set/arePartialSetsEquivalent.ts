import { canonicalizePartialSet } from "./canonicalizePartialSet";
import type { PartialSet } from "./partialSet";

/**
 * Determine whether two validated partial sets belong to the same partial-set class.
 *
 * Two partial sets are equivalent when their canonical representatives are equal.
 *
 * @param left The first validated partial set.
 * @param right The second validated partial set.
 * @returns `true` when both sets have the same canonical representative.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function arePartialSetsEquivalent(
  left: PartialSet,
  right: PartialSet,
): boolean {
  const canonicalLeft = canonicalizePartialSet(left);
  const canonicalRight = canonicalizePartialSet(right);

  return (
    canonicalLeft.members.length === canonicalRight.members.length &&
    canonicalLeft.members.every(
      (member, index) => member === canonicalRight.members[index],
    )
  );
}
