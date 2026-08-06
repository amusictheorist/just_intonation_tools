import { createPositiveInteger } from "./positiveInteger";
import { createRatio, type Ratio } from "./ratio";

/**
 * Multiplies two exact ratios and returns the canonical product.
 *
 * The result is reduced and frozen through `createRatio`.
 *
 * @param left The first ratio.
 * @param right The second ratio
 * @returns The exact immutable canonical product.
 */

export function multiplyRatios(left: Ratio, right: Ratio): Ratio {
  return createRatio(
    createPositiveInteger(left.numerator * right.numerator),
    createPositiveInteger(left.denominator * right.denominator),
  );
}
