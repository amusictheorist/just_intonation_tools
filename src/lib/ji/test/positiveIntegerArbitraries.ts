import fc from "fast-check";
import { createPositiveInteger } from "../integer/positiveInteger";

export const positiveIntegerArbitrary = fc
  .bigInt({ min: 1n })
  .map(createPositiveInteger);
