import type { Ratio } from "./ratio";

const SIGNIFICAND_BITS = 53;

/**
 * Approximates the base-2 logarithm of a ratio between two positive bigint values.
 *
 * Only the most significant bits of each value are converted to `number `, avoiding overflow while retaining sufficient precision for cents conversion.
 *
 * @param numerator The positive numerator.
 * @param denominator The positive denominator.
 * @returns The approximate base-2 logarithm of numerator divided by denominator.
 */

function log2BigIntRatio(numerator: bigint, denominator: bigint): number {
  const numeratorBits = numerator.toString(2).length;
  const denominatorBits = denominator.toString(2).length;

  const numeratorShift = Math.max(0, numeratorBits - SIGNIFICAND_BITS);
  const denominatorShift = Math.max(0, denominatorBits - SIGNIFICAND_BITS);

  const scaledNumerator = Number(numerator >> BigInt(numeratorShift));
  const scaledDenominator = Number(denominator >> BigInt(denominatorShift));

  return (
    Math.log2(scaledNumerator / scaledDenominator) +
    numeratorShift -
    denominatorShift
  );
}

/**
 * Converts an exact ratio to its approximate size in cents relative to unison.
 *
 * Ratios above unison produce positive values, unison produces zero, and ratios below unison produce negative values.
 *
 * @param ratio The exact ratio to convert.
 * @returns The approximate size of the ratio in cents relative to unison.
 */

export function ratioToCents(ratio: Ratio): number {
  return 1200 * log2BigIntRatio(ratio.numerator, ratio.denominator);
}
