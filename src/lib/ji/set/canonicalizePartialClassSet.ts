import { greatestCommonDivisor } from "../integer/greatestCommonDivisor";
import type { PositiveInteger } from "../integer/positiveInteger";
import { createPartialClass } from "../partial/partialClass";
import { createPartialClassSet, type PartialClassSet } from "./partialClassSet";

/**
 * Returns the canonical representative of a validated partial-class set.
 *
 * Every member is divided by the greatest common divisor of the set, and the result is returned as a normalized immutable partial-class set.
 *
 * @param partialClassSet A validated partial-class set.
 * @returns The canonical partial-class-set representative.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function canonicalizePartialClassSet(
  partialClassSet: PartialClassSet,
): PartialClassSet {
  let divisor: PositiveInteger = partialClassSet.members[0];

  for (const member of partialClassSet.members.slice(1)) {
    divisor = greatestCommonDivisor(divisor, member);
  }

  return createPartialClassSet(
    partialClassSet.members.map((member) =>
      createPartialClass(member / divisor),
    ),
  );
}
