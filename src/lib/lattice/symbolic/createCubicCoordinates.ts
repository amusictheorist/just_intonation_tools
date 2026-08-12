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
 * Converts prime exponents into symbolic coordinates for the standard 3-5-7 cubic lattice.
 *
 * Ratios containing any prime above 7 do not belong to this lattice and return `null`. Missing 3, 5, or 7 factors are treated as exponent 0.
 *
 * @param factors A validated map of prime exponents.
 * @returns The cubic coordinates of the validated map.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createCubicCoordinates(
  factors: PrimeExponents,
): CubicCoordinates | null {
  for (const prime of factors.keys()) {
    if (prime > 7n) return null;
  }

  return {
    x: factors.get(3n) ?? 0,
    y: factors.get(5n) ?? 0,
    z: factors.get(7n) ?? 0,
  };
}
