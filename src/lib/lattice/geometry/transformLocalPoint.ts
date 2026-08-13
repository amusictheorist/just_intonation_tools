import type { LocalFrame } from "./createLocalFrame";
import type { Vector3 } from "./createRadialDirectionVector";
import { transformLocalVector } from "./transformLocalVector";
import { addVectors } from "./vector";

/**
 * Transforms a point from local frame coordinates into world-space coordinates.
 *
 * The local point is first transformed through the frame's basis and then translated by the frame origin.
 *
 * @param point The opint expressed in local frame coordinates.
 * @param frame The frame that defines the local basis and world-space origin.
 * @returns The equivalent world-space point.
 */

export function transformLocalPoint(
  point: Vector3,
  frame: LocalFrame,
): Vector3 {
  return addVectors(frame.origin, transformLocalVector(point, frame));
}
