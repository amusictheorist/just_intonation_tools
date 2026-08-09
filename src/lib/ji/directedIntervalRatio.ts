import type { Partial } from "./partial";
import type { PartialClass } from "./partialClass";
import { createRatio, type Ratio } from "./ratio";

/**
 * Returns the directed interval ratio from a source value to a target value.
 *
 * The source and target must both be partials or both be partial classes.
 * The interval is feined as target divided by source and is returned in canonical reduced form. Descending intervals may therefore be less than one.
 * No octave reduction is applied.
 *
 * @param source The source partial or partial class.
 * @param target The target partial or partial class.
 * @returns The canonical directed interval ratio from source to target.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function directedIntervalRatio(source: Partial, target: Partial): Ratio;

export function directedIntervalRatio(
  source: PartialClass,
  target: PartialClass,
): Ratio;

export function directedIntervalRatio(
  source: Partial | PartialClass,
  target: Partial | PartialClass,
): Ratio {
  return createRatio(target, source);
}
