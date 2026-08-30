/**
 * Maps a partial to its octave-equivalent partial class by removing all factors of 2.
 *
 * @param value A validated partial.
 * @returns The corresponding partial class.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

import type { Partial } from "./partial";
import { createPartialClass, type PartialClass } from "./partialClass";

export function partialToPartialClass(partial: Partial): PartialClass {
  let reduced: bigint = partial;

  while (reduced % 2n === 0n) reduced /= 2n;

  return createPartialClass(reduced);
}
