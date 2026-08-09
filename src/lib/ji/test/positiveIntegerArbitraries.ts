import fc from "fast-check";
import { createPositiveInteger } from "../positiveInteger";

export const positiveIntegerArbitrary = fc
  .bigInt({ min: 1n })
  .map(createPositiveInteger);
