import type { Ratio } from "./ratio";

/**
 * Reports whether two canonical ratios represent the same exact value.
 *
 * Because every `Ratio` is stored in reduced canonical form, equality is determined by direct comparison of numerator and denominator terms.
 *
 * @param left The first canonical ratio.
 * @param right The second canonical ratio.
 * @returns `true` when both canonical terms are equal.
 */

export function areRatiosEqual(left: Ratio, right: Ratio): boolean {
  return (
    left.numerator === right.numerator && left.denominator === right.denominator
  );
}
