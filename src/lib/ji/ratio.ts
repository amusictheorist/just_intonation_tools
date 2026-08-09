import { greatestCommonDivisor } from "./greatestCommonDivisor";
import { createPositiveInteger, type PositiveInteger } from "./positiveInteger";

/**
 * An exact positive rational ratio stored in reduced canonical form.
 *
 * Ratio values are immutable at runtime. Numerator and denominator are validated positive integers, and their greatest common divisor is `1n`.
 *
 * @see ../docs/domain/CORE_JI_DOMAIN.md
 */

export type Ratio = Readonly<{
  numerator: PositiveInteger;
  denominator: PositiveInteger;
}>;

/**
 * Creates an exact immutable ratio in reduced canonical form.
 *
 * Both terms are revalidated at the runtime boundary. Equivalent inputs, such as `6/4` and `15/10`, therefore produce structurally equal ratio values with numerator `3n` and denominator `2n`.
 *
 * Parsing, decimal approximation, formatting, and octave reduction remain outside this operation.
 *
 * @param numerator A validated positive-integer numerator.
 * @param denominator A validated positive-integer denominator.
 * @returns A runtime-frozen canonical ratio.
 * @throws {Error} If either term is not a bigint greater than zero.
 *
 * @see ../docs/domain/CORE_JI_DOMAIN.md
 */

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
