import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";
import { createPrimeAnchorVector } from "./createPrimeAnchorVector";
import type { Vector3 } from "./createRadialDirectionVector";
import { scaleVector } from "./vector";

/**
 * Resolves a signed higher-prime generator step to its local anchor vector.
 *
 * Positive steps use the prime's canonical anchor vector. Negative steps use the inverse orientation by reflecting the vector through the local origin.
 *
 * @param step The signed higher-prime generator step to resolve.
 * @returns The local anchor vector for that step.
 */

export function resolvePrimeAnchorVector(step: PrimeFactorStep): Vector3 {
  const anchor = createPrimeAnchorVector(step.prime);

  return scaleVector(anchor, step.direction);
}
