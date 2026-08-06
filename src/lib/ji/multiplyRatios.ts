import { createPositiveInteger } from "./positiveInteger";
import { createRatio, type Ratio } from "./ratio";

export function multiplyRatios(left: Ratio, right: Ratio): Ratio {
  return createRatio(
    createPositiveInteger(left.numerator * right.numerator),
    createPositiveInteger(left.denominator * right.denominator),
  );
}
