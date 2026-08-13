import { createChildAnchorFrame } from "./createChildAnchorFrame";
import type { LocalFrame } from "./createLocalFrame";
import type { Vector3 } from "./createRadialDirectionVector";

/**
 * Creates the final local frame produced by a sequence of nested child
 * anchors.
 *
 * Each child anchor vector is interpreted in the local coordinate frame
 * produced by the preceding anchor. This recursively composes nested
 * higher-prime anchor placement rather than treating child vectors as
 * world-space offsets.
 *
 * An empty sequence returns the initial frame unchanged.
 *
 * @param childAnchors The ordered child-anchor vectors to apply.
 * @param initialFrame The frame from which nested placement begins.
 * @returns The final local frame after applying all child anchors.
 */

export function createNestedAnchorFrame(
  childAnchors: readonly Vector3[],
  initialFrame: LocalFrame,
): LocalFrame {
  let frame = initialFrame;

  for (const childAnchor of childAnchors) {
    frame = createChildAnchorFrame(childAnchor, frame);
  }

  return frame;
}
