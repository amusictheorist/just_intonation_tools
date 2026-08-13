import type { LocalFrame } from "./createLocalFrame";
import type { Vector3 } from "./createRadialDirectionVector";
import { addVectors, scaleVector } from "./vector";

/**
 * Transforms a vector from local frame coordinates into world-space direction coordinates.
 *
 * The local vector is expressed as a linear combination of the frame's x, y, and z axes. The frame origin is deliberatly ignored, so this function transforms offsets and directions rather than absolute points.
 *
 * @param vector The vector expressed in local frame coordinates.
 * @param frame The orthonormal frame that defines the local bases.
 * @returns The equivalent world-space vector.
 */

export function transformLocalVector(
  vector: Vector3,
  frame: LocalFrame,
): Vector3 {
  return addVectors(
    addVectors(
      scaleVector(frame.xAxis, vector.x),
      scaleVector(frame.yAxis, vector.y),
    ),
    scaleVector(frame.zAxis, vector.z),
  );
}
