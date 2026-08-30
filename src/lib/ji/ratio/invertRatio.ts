import { createRatio, type Ratio } from "./ratio";

export function invertRatio(ratio: Ratio): Ratio {
  return createRatio(ratio.denominator, ratio.numerator);
}
