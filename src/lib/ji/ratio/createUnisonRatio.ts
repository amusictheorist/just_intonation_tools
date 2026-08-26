import { createPositiveInteger } from "../integer/positiveInteger";
import { createRatio, type Ratio } from "./ratio";

/**
 * Creates the canonical unsion ratio 1/1
 */

export function createUnisonRatio(): Ratio {
  return createRatio(createPositiveInteger(1n), createPositiveInteger(1n));
}
