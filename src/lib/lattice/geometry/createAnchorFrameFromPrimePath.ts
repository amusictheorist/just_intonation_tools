import type { PrimeFactorStep } from "../symbolic/createCanonicalPrimeFactorPath";
import type { LocalFrame } from "./createLocalFrame";
import { createNestedAnchorFrame } from "./createNestedAnchorFrame";
import type { Vector3 } from "./createRadialDirectionVector";

export type PrimeAnchorVectorResolver = (step: PrimeFactorStep) => Vector3;

/**
 * Creates the final nested anchor frame for a canonical prime-factor path.
 *
 * Each prime-factor step is resolved to a canonical child-anchor vector,
 * then interpreted recursively in the local frame produced by the
 * preceding step.
 *
 * This function bridges symbolic higher-prime placement with geometric
 * nested-anchor placement while leaving the choice of canonical anchor
 * vectors to the supplied resolver.
 *
 * @param path The ordered prime-factor steps to apply.
 * @param initialFrame The frame from which nested anchor placement begins.
 * @param resolveAnchorVector Resolves each symbolic step to a local anchor vector.
 * @returns The final local frame after applying the complete prime path.
 */

export function createAnchorFrameFromPrimePath(
  path: readonly PrimeFactorStep[],
  initialFrame: LocalFrame,
  resolveAnchorVector: PrimeAnchorVectorResolver,
): LocalFrame {
  const childAnchors = path.map(resolveAnchorVector);

  return createNestedAnchorFrame(childAnchors, initialFrame);
}
