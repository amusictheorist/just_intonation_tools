import { canonicalizePartialClassSet } from "./canonicalizePartialClassSet";
import type { PartialClassSet } from "./partialClassSet";

/**
 * Sums the members of a partial-class set's canonical representative.
 *
 * This quantity is Parcspace Spectral Extension (SpecExt_pc).
 * Equivalent partial-class sets therefore produce the same result.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function canonicalPartialClassSetSum(
  partialClassSet: PartialClassSet,
): bigint {
  const canonical = canonicalizePartialClassSet(partialClassSet);

  return canonical.members.reduce((sum, member) => sum + member, 0n);
}
