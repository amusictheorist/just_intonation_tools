import { createPositiveInteger } from "../../ji/positiveInteger";
import { createRatio, type Ratio } from "../../ji/ratio";

/**
 * Normalizes a ratio for expanded radial placement while preserving which side of unison the original ratio occupies.
 *
 * Ratios at or above 1/1 are reduced by powers of 2 into [1, 2).
 * Ratios below 1/1 are raised by powers of 2 into [1/2, 1).
 *
 * This preserves all prime exponents other than 2, so octave normalization does not change the ratio's symbolic prime-factor structure.
 *
 * @param ratio A validated exact ratio.
 * @returns The side-preserving octave-normalized ratio.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function normalizeExpandedRadialRatio(ratio: Ratio): Ratio {
  let numerator: bigint = ratio.numerator;
  let denominator: bigint = ratio.denominator;

  if (numerator >= denominator) {
    while (numerator >= denominator * 2n) denominator *= 2n;
  }

  while (numerator * 2n < denominator) numerator *= 2n;

  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}
