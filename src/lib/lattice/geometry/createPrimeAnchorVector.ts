import type { Vector3 } from "./createRadialDirectionVector";
import { getHigherPrimeOrdinal } from "./getHigherPrimeOrdinal";

/**
 * Computes the radical inverse of a non-negative integer in the given base.
 *
 * The digits of the integer are reflected across the radix point to produce a deterministic value in the interval [0, 1). This is used to generate the low-discrepancy corrdinates for the provisional prime-anchor sphere.
 *
 * @param index The non-negative integer whose digits are reflected.
 * @param base The integer used for the radical inverse.
 * @returns A deterministic value in the interval [0, 1).
 */

function radicalInverse(index: bigint, base: bigint): number {
  let remaining = index;
  let fraction = 1 / Number(base);
  let result = 0;

  while (remaining > 0n) {
    const digit = remaining % base;
    result += Number(digit) * fraction;
    remaining /= base;
    fraction /= Number(base);
  }

  return result;
}

/**
 * Creates the provisional unit-sphere snachor vector for a higher prime.
 *
 * Higher primes are assigned permanent sequence positions by their higher-prime ordinal. A low-discrepancy spherical sequence then maps that ordinal to a deterministic unit vector.
 *
 * The current distribution is intended for geometry prototyping and may be revised after further visual evaluation. Symbolic prime identity and anchor ordering do not depend on the geometric choice.
 *
 * @param prime A prime greater than 7.
 * @returns A deterministic unit-sphere anchor vector for the prime.
 */

export function createPrimeAnchorVector(prime: bigint): Vector3 {
  const ordinal = getHigherPrimeOrdinal(prime);
  const sequenceIncex = ordinal + 1n;

  const latitudePosition = radicalInverse(sequenceIncex, 2n);
  const longitudePosition = radicalInverse(sequenceIncex, 3n);

  const z = 1 - 2 * latitudePosition;
  const radius = Math.sqrt(1 - z ** 2);
  const longitude = 2 * Math.PI * longitudePosition;

  return {
    x: radius * Math.cos(longitude),
    y: radius * Math.sin(longitude),
    z,
  };
}
