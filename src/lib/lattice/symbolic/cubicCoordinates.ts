import type { PrimeExponents } from "./factorPrimesIgnoringTwo";

/**
 * Represents symbolic coordinates in the standard 3-5-7 cubic lattice.
 *
 * the exponent of 3 maps to `x`, the exponent of 5 maps to `y`, and the exponent of 7 maps to `z`. Positive and negative exponents therefore place ratios on opposite sides of the origin along each axis.
 */

export type CubicCoordinates = Readonly<{
  x: number;
  y: number;
  z: number;
}>;

/**
 * Creates cubic coordinates from the exponents of 3, 5, and 7.
 *
 * Any other prime factors in the map are ignored. This function is intended for placement logic that has already separated higher-prime factors from the local 3-5-7 coordinates.
 *
 * @param factors A validated map of prime exponents.
 * @returns The corresponding 3-57 cubic coordinates.
 */

export function extractCubicCoordinates(
  factors: PrimeExponents,
): CubicCoordinates {
  return {
    x: factors.get(3n) ?? 0,
    y: factors.get(5n) ?? 0,
    z: factors.get(7n) ?? 0,
  };
}

/**
 * Converts prime exponents into symbolic coordinates for the standard 3-5-7 cubic lattice.
 *
 * Ratios containing any prime above 7 do not belong to this lattice and return `null`. Missing 3, 5, or 7 factors are treated as exponent 0.
 *
 * @param factors A validated map of prime exponents.
 * @returns The cubic coordinates, or `null` when a prime above 7 is present.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createStandardCubicCoordinates(
  factors: PrimeExponents,
): CubicCoordinates | null {
  for (const prime of factors.keys()) {
    if (prime > 7n) return null;
  }

  return extractCubicCoordinates(factors);
}
