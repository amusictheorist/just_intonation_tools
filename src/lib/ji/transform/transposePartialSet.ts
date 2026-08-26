import type { PositiveInteger } from "../integer/positiveInteger";
import { createPartial } from "../partial/partial";
import { createPartialSet, type PartialSet } from "../set/partialSet";

/**
 * Transposes a validated partial set by a positive integer factor.
 *
 * Every member is multiplied by the factor and returned as a normalized immutable partial set. Transposition preserves cardinality and partial-set class membership.
 *
 * @param partialSet The validated partial set to transpose.
 * @param factor The validated positive integer transposition factor.
 * @returns The transposed partial set.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function transposePartialSet(
  partialSet: PartialSet,
  factor: PositiveInteger,
): PartialSet {
  return createPartialSet(
    partialSet.members.map((member) => createPartial(member * factor)),
  );
}
