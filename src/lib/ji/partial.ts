import { createPositiveInteger, type PositiveInteger } from "./positiveInteger";

declare const partialBrand: unique symbol;

/**
 * A validated positive partial in Parspace.
 *
 * Every `Partial` is a `PositiveInteger`, but the additional brand preserves the domain distinction between a generic positive integer and a partial.
 */

export type Partial = PositiveInteger & {
  readonly [partialBrand]: true;
};

/**
 * Creates a validated partial from an exact positive bigint.
 *
 * @param value A bigint greater than zero.
 * @returns The validated partial.
 * @throws {Error} If the value is not a bigint greater than zero.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`.
 */

export function createPartial(value: bigint) {
  return createPositiveInteger(value) as Partial;
}
