import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";

/**
 * Calculates the radial angle of a signed prime-factor step.
 *
 * The prime is octave-normalized into [1, 2) before conversion to an angular position. Negative steps use the octave-normalized inverse interval, placing positive and negative directions at complementary angles aroung the radial plane.
 *
 * This function marks an explicit boundary between exact symbolic lattice values and floating-point geometry.
 *
 * @param step A canonical signed prime-factor step.
 * @returns The radial angle in degrees.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function calculateRadialPrimeAngle(step: PrimeFactorStep): number {
  let value = Number(step.prime);

  while (value >= 2) value /= 2;

  if (step.direction === -1) {
    value = 1 / value;

    while (value < 1) value *= 2;
  }

  return Math.log2(value) * 360;
}
