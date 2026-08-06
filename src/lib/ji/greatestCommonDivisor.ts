import { createPositiveInteger, type PositiveInteger } from "./positiveInteger";

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
