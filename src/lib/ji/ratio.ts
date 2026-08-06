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
  const validatedNumerator = createPositiveInteger(numerator);
  const validatedDenominator = createPositiveInteger(denominator);

  const divisor = greatestCommonDivisor(
    validatedNumerator,
    validatedDenominator,
  );

  return Object.freeze({
    numerator: createPositiveInteger(validatedNumerator / divisor),
    denominator: createPositiveInteger(validatedDenominator / divisor),
  });
}
