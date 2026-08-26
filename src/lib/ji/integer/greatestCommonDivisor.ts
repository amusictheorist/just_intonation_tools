import { createPositiveInteger, type PositiveInteger } from "./positiveInteger";

/**
 * Returns the greatest common divisor of two positive integers.
 *
 * Uses the Euclidean algorithm with exact `bigint` arithmetic.
 *
 * @param left A validated positive integer.
 * @param right A validated positive integer.
 * @returns Their validated positive greatest common divisor.
 */

export function greatestCommonDivisor(
  left: PositiveInteger,
  right: PositiveInteger,
): PositiveInteger {
  let dividend: bigint = left;
  let divisor: bigint = right;

  while (divisor !== 0n) {
    const remainder = dividend % divisor;
    dividend = divisor;
    divisor = remainder;
  }

  return createPositiveInteger(dividend);
}
