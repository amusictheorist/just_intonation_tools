import { greatestCommonDivisor } from "../integer/greatestCommonDivisor";
import type { PositiveInteger } from "../integer/positiveInteger";
import { createPartial } from "../partial/partial";
import { createPartialSet, type PartialSet } from "./partialSet";

/**
 * Returns the canonical representative of a validated partial set.
 *
 * Evey member is divided by the greatest common divisor of the set, and the result is retuned as a normalized immutable partial set.
 *
 * @param partialSet A validated partial set.
 * @returns The canonical partial-set representative.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function canonicalizePartialSet(partialSet: PartialSet): PartialSet {
  let divisor: PositiveInteger = partialSet.members[0];

  for (const member of partialSet.members.slice(1)) {
    divisor = greatestCommonDivisor(divisor, member);
  }

  return createPartialSet(
    partialSet.members.map((member) => createPartial(member / divisor)),
  );
}
