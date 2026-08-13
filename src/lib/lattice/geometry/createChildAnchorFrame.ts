import { createChildAnchorPosition } from "./createChildAnchorPosition";
import { createLocalFrame, type LocalFrame } from "./createLocalFrame";
import type { Vector3 } from "./createRadialDirectionVector";
import { transformLocalVector } from "./transformLocalVector";

/**
 * Creates a child anchor frame relative to a parent local frame.
 *
 * The child anchor vector is interpreted in the parent frame's local
 * coordinates. Its transformed world-space position becomes the child
 * frame origin, while the transformed parent-to-child displacement
 * determines the child frame's local z-axis.
 *
 * This preserves hierarchical anchor orientation for nested higher-prime
 * lattice placement.
 *
 * @param childAnchor The child anchor vector in parent-local coordinates.
 * @param parentFrame The parent frame used to interpret the child anchor.
 * @returns The child anchor's world-space local frame.
 */

export function createChildAnchorFrame(
  childAnchor: Vector3,
  parentFrame: LocalFrame,
): LocalFrame {
  const childPosition = createChildAnchorPosition(childAnchor, parentFrame);
  const childDirection = transformLocalVector(childAnchor, parentFrame);

  return createLocalFrame(childPosition, childDirection);
}
