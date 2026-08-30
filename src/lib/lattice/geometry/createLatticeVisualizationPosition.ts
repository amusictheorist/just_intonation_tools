import type { LatticeGeometry } from "../state/latticeGeometry";
import type { LatticeVisualizationPlacement } from "../symbolic/createLatticeVisualizationPlacement";
import { createExpandedCubicPosition } from "./createExpandedCubicPosition";
import type { PrimeAnchorVectorResolver } from "./createAnchorPositionsFromPrimePath";
import type { Vector3 } from "./vector";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";
import { createRadialPosition } from "./createRadialPosition";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";
import {
  CUBIC_SPACING,
  LATTICE_ORIGIN,
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

/**
 * Resolves symbolic lattice placement into scaled Cartesian geometry.
 *
 * Visualization-family spacing is applied here, keeping symbolic placement independent from rendered scene scale.
 *
 * @param input The compatible symbolic placement and geometry configuration for the selected lattice visualization family.
 * @param resolveAnchorVector Resolves higher-prime steps to canonical anchor vectors before higher-prime radius and cubic spacing are applied.
 * @returns The final scaled Cartesian position.
 */

export function createLatticeVisualizationPosition(
  input: LatticeVisualizationPositionInput,
  resolveAnchorVector: PrimeAnchorVectorResolver = resolvePrimeAnchorVector,
): Vector3 {
  const { placement, geometry } = input;

  if (
    placement.type === "cubic" &&
    placement.variant.type === "standard" &&
    geometry.type === "cubic"
  ) {
    return scaleVector(placement.variant.coordinates, CUBIC_SPACING);
  }

  if (
    placement.type === "cubic" &&
    placement.variant.type === "expanded" &&
    geometry.type === "cubic"
  ) {
    const resolveScaledAnchorVector: PrimeAnchorVectorResolver = (step) =>
      scaleVector(resolveAnchorVector(step), geometry.higherPrimeRadius);

    const position = createExpandedCubicPosition(
      placement.variant.address,
      LATTICE_ORIGIN,
      geometry.higherPrimeRotation,
      resolveScaledAnchorVector,
    );

    return scaleVector(position, CUBIC_SPACING);
  }

  if (
    placement.type === "radial" &&
    placement.variant.type === "standard" &&
    geometry.type === "radial"
  ) {
    const position = createRadialPosition(
      placement.variant.address,
      geometry.includeGeneratorHeight,
    );

    return scaleRadialPosition(position);
  }

  if (
    placement.type === "radial" &&
    placement.variant.type === "expanded" &&
    geometry.type === "radial"
  ) {
    const position = createExpandedRadialPosition(
      placement.variant.address,
      geometry.includeGeneratorHeight,
      geometry.lowerSymmetry,
    );

    return scaleRadialPosition(position);
  }

  throw new Error("Unsupported lattice visualization position");
}
