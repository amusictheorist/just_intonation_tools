import type { PartialSet } from "../set/partialSet";
import { canonicalizePartialSet } from "../set/canonicalizePartialSet";

/**
 * Sums the members of a partial set's canonical representative.
 *
 * This quantity is Parspace Spectral Extension (SpecExt_p).
 * Equivalent partial sets therefore produce the same result.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function canonicalPartialSetSum(partialSet: PartialSet): bigint {
  const canonical = canonicalizePartialSet(partialSet);

  return canonical.members.reduce((sum, member) => sum + member, 0n);
}
