import type { LatticeGeometry } from "../state/latticeGeometry";
import type { LatticeVisualizationPlacement } from "../symbolic/createLatticeVisualizationPlacement";
import { createExpandedCubicPosition } from "./createExpandedCubicPosition";
import type { PrimeAnchorVectorResolver } from "./createAnchorPositionsFromPrimePath";
import type { Vector3 } from "./createRadialDirectionVector";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";
import { createRadialPosition } from "./createRadialPosition";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";
import {
  CUBIC_SPACING,
  RADIAL_HORIZONTAL_SPACING,
  RADIAL_VERTICAL_SPACING,
} from "./latticeGeometryConstants";
import { scaleVector } from "./vector";

export type LatticeVisualizationPositionInput =
  | Readonly<{
      placement: Extract<LatticeVisualizationPlacement, { type: "cubic" }>;
      geometry: Extract<LatticeGeometry, { type: "cubic" }>;
    }>
  | Readonly<{
      placement: Extract<LatticeVisualizationPlacement, { type: "radial" }>;
      geometry: Extract<LatticeGeometry, { type: "radial" }>;
    }>;

function scaleRadialPosition(position: Vector3): Vector3 {
  return {
    x: position.x * RADIAL_HORIZONTAL_SPACING,
    y: position.y * RADIAL_VERTICAL_SPACING,
    z: position.z * RADIAL_HORIZONTAL_SPACING,
  };
}

export function createLatticeVisualizationPosition(
  input: LatticeVisualizationPositionInput,
  resolveAnchorVector: PrimeAnchorVectorResolver = resolvePrimeAnchorVector,
): Vector3 {
  const { placement, geometry } = input;

  if (
    placement.type === "cubic" &&
    placement.placement.type === "standard" &&
    geometry.type === "cubic"
  ) {
    return scaleVector(placement.placement.coordinates, CUBIC_SPACING);
  }

  if (
    placement.type === "cubic" &&
    placement.placement.type === "expanded" &&
    geometry.type === "cubic"
  ) {
    const resolveScaledAnchorVector: PrimeAnchorVectorResolver = (step) =>
      scaleVector(resolveAnchorVector(step), geometry.higherPrimeRadius);

    const position = createExpandedCubicPosition(
      placement.placement.address,
      { x: 0, y: 0, z: 0 },
      geometry.localRotation,
      resolveScaledAnchorVector,
    );

    return scaleVector(position, CUBIC_SPACING);
  }

  if (
    placement.type === "radial" &&
    placement.placement.type === "standard" &&
    geometry.type === "radial"
  ) {
    const position = createRadialPosition(
      placement.placement.address,
      geometry.includeGeneratorHeight,
    );

    return scaleRadialPosition(position);
  }

  if (
    placement.type === "radial" &&
    placement.placement.type === "expanded" &&
    geometry.type === "radial"
  ) {
    const position = createExpandedRadialPosition(
      placement.placement.address,
      geometry.includeGeneratorHeight,
      geometry.lowerSymmetry,
    );

    return scaleRadialPosition(position);
  }

  throw new Error("Unsupported lattice visualization position");
}
