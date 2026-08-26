import { createPositiveInteger } from "../integer/positiveInteger";
import { createRatio, type Ratio } from "../ratio/ratio";

export function createTestRatio(numerator: bigint, denominator: bigint): Ratio {
  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}
