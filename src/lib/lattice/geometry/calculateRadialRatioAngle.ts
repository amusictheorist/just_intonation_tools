import type { Ratio } from "../../ji/ratio";

export function calculateRadialRatioAngle(ratio: Ratio): number {
  const value = Number(ratio.numerator) / Number(ratio.denominator);

  return (Math.log(value) / Math.log(2)) * 360;
}
