import { greatestCommonDivisor } from "./greatestCommonDivisor";
import { createPositiveInteger, type PositiveInteger } from "./positiveInteger";

export type Ratio = Readonly<{
  numerator: PositiveInteger;
  denominator: PositiveInteger;
}>;

export function createRatio(
  numerator: PositiveInteger,
  denominator: PositiveInteger,
): Ratio {
  const divisor = greatestCommonDivisor(numerator, denominator);

  return Object.freeze({
    numerator: createPositiveInteger(numerator / divisor),
    denominator: createPositiveInteger(denominator / divisor),
  });
}
