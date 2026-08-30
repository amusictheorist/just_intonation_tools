import { directedIntervalRatio } from "../ratio/directedIntervalRatio";
import type { PartialSet } from "../set/partialSet";
import type { Ratio } from "../ratio/ratio";

/**
 * Returns the directed interval matrix for a validated partial set.
 *
 * Rows and columns follow the partial set's deterministic member ordering.
 * Each cell contains the canonical directed interval ratio from the row member to the column member. Diagonal entries are therefore unison ratios.
 *
 * @param partialSet The validated partial set.
 * @returns An immutable-by-contract matrix of canonical directed interval ratios.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function partialSetIntervalMatrix(
  partialSet: PartialSet,
): readonly (readonly Ratio[])[] {
  return partialSet.members.map((source) =>
    partialSet.members.map((target) => directedIntervalRatio(source, target)),
  );
}
