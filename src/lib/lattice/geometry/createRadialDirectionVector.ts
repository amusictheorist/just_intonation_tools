import type { Vector3 } from "./vector";

/**
 * Converts a radial angle in degrees into a unit direction vector in the x-y-z plane.
 *
 * Zero degrees points along the negative z-axis, and increasing angles rotate clockwise toward the positive x-axis. The y component remains zero because vertical displacement is handled separately by radial placement.
 *
 * @param angleDegrees The radial angle in degrees.
 * @returns A unit direction vector in the x-y-z plane.
 *
 * @see `docs/subsystems/lattice/PLACEMENT.md`
 */

export function createRadialDirectionVector(angleDegrees: number): Vector3 {
  const angleRadians = (angleDegrees * Math.PI) / 180;

  return {
    x: Math.sin(angleRadians),
    y: 0,
    z: -Math.cos(angleRadians),
  };
}
