import type { CubicVisualizationPlacement } from "../symbolic/createCubicVisualizationPlacement";
import { createExpandedCubicConnections } from "./createExpandedCubicConnections";
import { createStandardCubicConnections } from "./createStandardCubicConnections";
import type { LatticeConnection } from "./latticeConnection";

export type CubicVisualizationConnectionPoint = Readonly<{
  id: string;
  placement: CubicVisualizationPlacement;
}>;

export function createCubicVisualizationConnections(
  points: readonly CubicVisualizationConnectionPoint[],
): readonly LatticeConnection[] {
  const standardPoints = points
    .filter(
      (
        point,
      ): point is Readonly<{
        id: string;
        placement: Extract<CubicVisualizationPlacement, { type: "standard" }>;
      }> => point.placement.type === "standard",
    )
    .map((point) => ({
      id: point.id,
      coordinates: point.placement.coordinates,
    }));

  const expandedPoints = points
    .filter(
      (
        point,
      ): point is Readonly<{
        id: string;
        placement: Extract<CubicVisualizationPlacement, { type: "expanded" }>;
      }> => point.placement.type === "expanded",
    )
    .map((point) => ({
      id: point.id,
      address: point.placement.address,
    }));

  if (standardPoints.length > 0 && expandedPoints.length > 0) {
    throw new Error("Mixed cubic visualization placements");
  }

  if (expandedPoints.length > 0)
    return createExpandedCubicConnections(expandedPoints);

  return createStandardCubicConnections(standardPoints);
}
