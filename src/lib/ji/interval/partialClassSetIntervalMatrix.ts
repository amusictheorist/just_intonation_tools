import { directedIntervalRatio } from "../ratio/directedIntervalRatio";
import type { PartialClassSet } from "../set/partialClassSet";
import type { Ratio } from "../ratio/ratio";

/**
 * Returns the directed interval matrix for a validated partial-class set.
 *
 * Rows and columns follow the partial-class set's deterministic ordering. Each cell contains the canonical directed interval ratio from the row member to the column member. Diagonal entries are therefore unison ratios.
 *
 * @param partialClassSet The validated partial-class set.
 * @returns An immutable-by-contract matrix of canonical directed interval ratios.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function partialClassSetIntervalMatrix(
  partialClassSet: PartialClassSet,
): readonly (readonly Ratio[])[] {
  return partialClassSet.members.map((source) =>
    partialClassSet.members.map((target) =>
      directedIntervalRatio(source, target),
    ),
  );
}
