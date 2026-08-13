import type { Vector3 } from "./createRadialDirectionVector";
import { crossProduct, dotProduct, normalizeVector } from "./vector";

/**
 * Represents a local orthonormal coordinate frame for lattice geometry.
 *
 * `origin` gives the frame's world-space position. The three axes define the local x, y, and z directions used to transform nested lattice geometry into world space.
 */

export type LocalFrame = Readonly<{
  origin: Vector3;
  xAxis: Vector3;
  yAxis: Vector3;
  zAxis: Vector3;
}>;

/**
 * Creates a deterministic orthonormal frame at an anchor position.
 *
 * The normalized anchor direction becomes the local z-axis. The local x-axis is constructed perpendicular to that direction using global up as a reference. When the anchor direction is parallel to global up, the global x-axis is used as a fallback reference to avoid a zero cross product. The local y-axis is then derived from the resulting x- and z-axes.
 *
 * This frame provides the orientation used to interpret child anchor vectors relative to a parent anchor in expanded cubic placement.
 *
 * @param anchor The world-space position of the frame origin.
 * @returns An orhonormal local frame rooted at the anchor.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createLocalFrame(anchor: Vector3): LocalFrame {
  const zAxis = normalizeVector(anchor);

  const globalUp: Vector3 = { x: 0, y: 1, z: 0 };
  const fallbackReference: Vector3 = { x: 1, y: 0, z: 0 };

  const referenceAxis =
    Math.abs(dotProduct(globalUp, zAxis)) === 1 ? fallbackReference : globalUp;

  const xAxis = normalizeVector(crossProduct(referenceAxis, zAxis));
  const yAxis = normalizeVector(crossProduct(zAxis, xAxis));

  return {
    origin: anchor,
    xAxis,
    yAxis,
    zAxis,
  };
}
