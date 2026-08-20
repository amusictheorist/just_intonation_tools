import { createPositiveInteger } from "../../ji/positiveInteger";
import { createRatio, type Ratio } from "../../ji/ratio";

/**
 * Normalzes a ratio into the upper octave [1, 2) for standard radial placement.
 *
 * Powers of 2 do not affect radial angle, so octave-equivalent ratios share the same normalized ratio and therefore the same angular position.
 *
 * @param ratio A validated exact ratio.
 * @returns The octave-normalized ratio in [1, 2).
 */

export function normalizeRadialRatio(ratio: Ratio): Ratio {
  let numerator: bigint = ratio.numerator;
  let denominator: bigint = ratio.denominator;

  while (numerator < denominator) numerator *= 2n;
  while (numerator >= denominator * 2n) denominator *= 2n;

  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}
