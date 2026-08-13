import { createPositiveInteger } from "../positiveInteger";
import { createRatio, type Ratio } from "../ratio";

export function createTestRatio(numerator: bigint, denominator: bigint): Ratio {
  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}
