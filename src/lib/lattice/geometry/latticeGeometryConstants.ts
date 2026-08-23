import type { CubicLocalRotation } from "../state/latticeGeometry";
import type { Vector3 } from "./vector";

export const CUBIC_SPACING = 2;
export const RADIAL_HORIZONTAL_SPACING = 2;
export const RADIAL_VERTICAL_SPACING = 1;

export const LATTICE_ORIGIN: Vector3 = { x: 0, y: 0, z: 0 };

export const DEFAULT_HIGHER_PRIME_RADIUS = 1;
export const DEFAULT_CUBIC_LOCAL_ROTATION: CubicLocalRotation = {
  x: 0,
  y: 0,
  z: 0,
};
