import { createPositiveInteger } from "../../ji/integer/positiveInteger";
import { createRatio, type Ratio } from "../../ji/ratio/ratio";

/**
 * Normalizes a ratio into the upper octave [1, 2).
 *
 * Powers of 2 do not affect the normalized result, so octave-equivalent ratios produce the same upper-octave representative.
 *
 * @param ratio The validated exact ratio to normalize.
 * @returns The octave-equivalent ratio in [1, 2).
 */

export function normalizeRatioToUpperOctave(ratio: Ratio): Ratio {
  let numerator: bigint = ratio.numerator;
  let denominator: bigint = ratio.denominator;

  while (numerator < denominator) numerator *= 2n;
  while (numerator >= denominator * 2n) denominator *= 2n;

  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}
