import { greatestCommonDivisor } from "./greatestCommonDivisor";
import type { PositiveInteger } from "./positiveInteger";

/**
 * Returns the least common multiple of two validated positive integers.
 *
 * The result is calculated exactly using the shared greates-common-divisor operation and remains a validated positive integer.
 *
 * @param left The first positive integer.
 * @param right The first positive integer.
 * @returns Their least common multiple
 */

export function leastCommonMultiple(
  left: PositiveInteger,
  right: PositiveInteger,
): PositiveInteger {
  const divisor = greatestCommonDivisor(left, right);

  return ((left / divisor) * right) as PositiveInteger;
}
