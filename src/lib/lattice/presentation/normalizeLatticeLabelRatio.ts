import { createPositiveInteger } from "../../ji/positiveInteger";
import { createRatio, type Ratio } from "../../ji/ratio";

export function normalizeLatticeLabelRatio(ratio: Ratio): Ratio {
  let numerator: bigint = ratio.numerator;
  let denominator: bigint = ratio.denominator;

  while (numerator < denominator) numerator *= 2n;

  while (numerator >= denominator * 2n) denominator *= 2n;

  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}
