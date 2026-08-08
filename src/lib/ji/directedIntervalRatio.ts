import type { Partial } from "./partial";
import { createRatio } from "./ratio";

/**
 * Returns the directed interval ratio from a source partial to a target partial
 *
 * The interval is defined as target divided by source and is returned in canonical reduced form. Descending intervals may therefore be less than one.
 * No octave reduction is applied.
 *
 * @param source The source partial.
 * @param target The target partial.
 * @returns The canonical directed interval ratio from source to target.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function directedIntervalRatio(source: Partial, target: Partial) {
  return createRatio(target, source);
}
