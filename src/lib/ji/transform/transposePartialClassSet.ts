import { createPartialClass, type PartialClass } from "../partial/partialClass";
import {
  createPartialClassSet,
  type PartialClassSet,
} from "../set/partialClassSet";

/**
 * Transposes a validated partial-class set by an odd positive integer factor.
 *
 * Every member is multiplied by the factor and returned as a normalized
 * immutable partial-class set. Transposition preserves cardinality and
 * partial-class-set class membership.
 *
 * @param partialClassSet The validated partial-class set to transpose.
 * @param factor The validated odd positive integer transposition factor.
 * @returns The transposed partial-class set.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`.
 */

export function transposePartialClassSet(
  partialClassSet: PartialClassSet,
  factor: PartialClass,
): PartialClassSet {
  return createPartialClassSet(
    partialClassSet.members.map((member) =>
      createPartialClass(member * factor),
    ),
  );
}
