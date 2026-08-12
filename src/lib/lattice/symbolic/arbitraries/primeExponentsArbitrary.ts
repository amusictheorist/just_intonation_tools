import fc from "fast-check";
import type { PrimeExponents } from "../factorPrimesIgnoringTwo";

const oddPrimeArbitrary = fc.constantFrom(3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n);

const nonzeroExponentArbitrary = fc
  .integer({ min: -5, max: 5 })
  .filter((exponent) => exponent !== 0);

export const primeExponentsArbitrary = fc
  .uniqueArray(fc.tuple(oddPrimeArbitrary, nonzeroExponentArbitrary), {
    selector: (prime) => prime,
    maxLength: 8,
  })
  .map((entries): PrimeExponents => new Map(entries));
