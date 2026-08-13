import type { LocalFrame } from "./createLocalFrame";
import type { Vector3 } from "./createRadialDirectionVector";
import { transformLocalPoint } from "./transformLocalPoint";

export function createChildAnchorPosition(
  childAnchor: Vector3,
  parentFrame: LocalFrame,
): Vector3 {
  return transformLocalPoint(childAnchor, parentFrame);
}
