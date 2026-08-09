declare const positiveIntegerBrand: unique symbol;

/**
 * An exact bigint value grater than zero.
 *
 * Values of this type must be created through {@link createPositiveInteger}.
 */

export type PositiveInteger = bigint & {
  readonly [positiveIntegerBrand]: true;
};

/**
 * Validates and brands an exact positive integer for use by the shared JI domain.
 *
 * Parsing and conversion from strings, numbers, or decimal values belong outside the core domain.
 *
 * @param value A bigint greater than zero.
 * @returns The validated positive integer.
 * @throws {Error} If the value is not a bigint greater than zero.
 *
 * @see ../docs/domain/CORE_JI_DOMAIN.md
 */

export function createPositiveInteger(value: bigint): PositiveInteger {
  if (typeof value !== "bigint" || value <= 0n) {
    throw new Error("Expected a positive bigint");
  }

  return value as PositiveInteger;
}
