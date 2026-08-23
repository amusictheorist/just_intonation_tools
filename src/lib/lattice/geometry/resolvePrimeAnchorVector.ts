import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";
import { createPrimeAnchorVector } from "./createPrimeAnchorVector";
import type { Vector3 } from "./vector";
import { scaleVector } from "./vector";

/**
 * Resolves a signed higher-prime generator step to its global anchor vector.
 *
 * Positive steps use the prime's canonical anchor vector. Negative steps use the opposite direction along the same global prime axis.
 *
 * @param step The signed higher-prime generator step to resolve.
 * @returns The signed global anchor vector for that step.
 */

export function resolvePrimeAnchorVector(step: PrimeFactorStep): Vector3 {
  const anchor = createPrimeAnchorVector(step.prime);

  return scaleVector(anchor, step.direction);
}
