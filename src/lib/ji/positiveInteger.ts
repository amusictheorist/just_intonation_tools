declare const positiveIntegerBrand: unique symbol;

export type PositiveInteger = bigint & {
  readonly [positiveIntegerBrand]: true;
};

export function createPositiveInteger(value: bigint): PositiveInteger {
  if (typeof value !== "bigint" || value <= 0n) {
    throw new Error("Expected a positive bigint");
  }

  return value as PositiveInteger;
}
