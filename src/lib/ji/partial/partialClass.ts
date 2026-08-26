import {
  createPositiveInteger,
  type PositiveInteger,
} from "../integer/positiveInteger";

declare const partialClassBrand: unique symbol;

/**
 * A validated partial class in Parcspace.
 *
 * Every `PartialClass` is a `PositiveInteger`, but the additional brand preserves the domain distinction between a generic positive integer, a partial, and a partial class.
 */

export type PartialClass = PositiveInteger & {
  readonly [partialClassBrand]: true;
};

/**
 * Creates a validated partial class from an exact positive odd bigint.
 *
 * @param value An odd bigint greater than zero.
 * @returns The validated partial class.
 * @throws {Error} If the value is not a positive bigint or is even.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function createPartialClass(value: bigint) {
  const positiveInteger = createPositiveInteger(value);

  if (positiveInteger % 2n === 0n) {
    throw new Error("Expected an odd positive bigint");
  }

  return positiveInteger as PartialClass;
}
