import { createRatio, type Ratio } from "./ratio";

export function inverRatio(ratio: Ratio): Ratio {
  return createRatio(ratio.denominator, ratio.numerator);
}
