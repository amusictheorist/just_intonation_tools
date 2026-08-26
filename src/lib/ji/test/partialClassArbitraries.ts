import fc from "fast-check";
import { createPartialClass } from "../partial/partialClass";

export const positiveOddBigIntArbitrary = fc
  .bigInt({ min: 1n })
  .map((value) => value * 2n - 1n);

export const partialClassArbitrary =
  positiveOddBigIntArbitrary.map(createPartialClass);
