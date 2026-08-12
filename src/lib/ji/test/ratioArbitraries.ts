import fc from "fast-check";
import { createRatio } from "../ratio";
import { createPositiveInteger } from "../positiveInteger";

export const ratioArbitrary = fc
  .tuple(fc.bigInt({ min: 1n }), fc.bigInt({ min: 1n }))
  .map(([numerator, denominator]) =>
    createRatio(
      createPositiveInteger(numerator),
      createPositiveInteger(denominator),
    ),
  );

export const factorableRatioArbitrary = fc
  .tuple(
    fc.bigInt({ min: 1n, max: 1_000_000n }),
    fc.bigInt({ min: 1n, max: 1_000_000n }),
  )
  .map(([numerator, denominator]) =>
    createRatio(
      createPositiveInteger(numerator),
      createPositiveInteger(denominator),
    ),
  );
