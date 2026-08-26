import type { CubicVisualizationVariant } from "../../symbolic/createCubicVisualizationVariant";
import { createExpandedCubicConnections } from "./createExpandedCubicConnections";
import { createStandardCubicConnections } from "./createStandardCubicConnections";
import type { LatticeConnection } from "../latticeConnection";

export type CubicVisualizationConnectionPoint = Readonly<{
  id: string;
  variant: CubicVisualizationVariant;
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
        variant: Extract<CubicVisualizationVariant, { type: "standard" }>;
      }> => point.variant.type === "standard",
    )
    .map((point) => ({
      id: point.id,
      coordinates: point.variant.coordinates,
    }));

  const expandedPoints = points
    .filter(
      (
        point,
      ): point is Readonly<{
        id: string;
        variant: Extract<CubicVisualizationVariant, { type: "expanded" }>;
      }> => point.variant.type === "expanded",
    )
    .map((point) => ({
      id: point.id,
      address: point.variant.address,
    }));

  if (standardPoints.length > 0 && expandedPoints.length > 0) {
    throw new Error("Mixed cubic visualization variants");
  }

  if (expandedPoints.length > 0)
    return createExpandedCubicConnections(expandedPoints);

  return createStandardCubicConnections(standardPoints);
}
