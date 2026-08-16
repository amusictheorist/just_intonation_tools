import type { LatticeGeometry } from "../state/latticeGeometry";
import type { LatticeVisualizationPlacement } from "../symbolic/createLatticeVisualizationPlacement";
import { createExpandedCubicPosition } from "./createExpandedCubicPosition";
import type { PrimeAnchorVectorResolver } from "./createAnchorPositionsFromPrimePath";
import type { Vector3 } from "./createRadialDirectionVector";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";
import { createRadialPosition } from "./createRadialPosition";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";

export type LatticeVisualizationPositionInput =
  | Readonly<{
      placement: Extract<LatticeVisualizationPlacement, { type: "cubic" }>;
      geometry: Extract<LatticeGeometry, { type: "cubic" }>;
    }>
  | Readonly<{
      placement: Extract<LatticeVisualizationPlacement, { type: "radial" }>;
      geometry: Extract<LatticeGeometry, { type: "radial" }>;
    }>;

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
    return placement.placement.coordinates;
  }

  if (
    placement.type === "cubic" &&
    placement.placement.type === "expanded" &&
    geometry.type === "cubic"
  ) {
    return createExpandedCubicPosition(
      placement.placement.address,
      { x: 0, y: 0, z: 0 },
      resolveAnchorVector,
    );
  }

  if (
    placement.type === "radial" &&
    placement.placement.type === "standard" &&
    geometry.type === "radial"
  ) {
    return createRadialPosition(
      placement.placement.address,
      geometry.includeGeneratorHeight,
    );
  }

  if (
    placement.type === "radial" &&
    placement.placement.type === "expanded" &&
    geometry.type === "radial"
  ) {
    return createExpandedRadialPosition(
      placement.placement.address,
      geometry.includeGeneratorHeight,
      geometry.lowerSymmetry,
    );
  }

  throw new Error("Unsupported lattice visualization position");
}
