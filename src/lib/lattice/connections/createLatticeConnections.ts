import type { PositionedLatticeRatio } from "../state/createPositionedLatticeRatios";
import { createCubicVisualizationConnections } from "./createCubicVisualizationConnections";
import { createRadialVisualizationConnections } from "./createRadialVisualizationConnections";
import type { LatticeConnection } from "./latticeConnection";

export function createLatticeConnections(
  ratios: readonly PositionedLatticeRatio[],
): readonly LatticeConnection[] {
  const cubicPoints = ratios
    .filter(
      (
        ratio,
      ): ratio is PositionedLatticeRatio & {
        placement: Extract<
          PositionedLatticeRatio["placement"],
          { type: "cubic" }
        >;
      } => ratio.placement.type === "cubic",
    )
    .map((ratio) => ({
      id: ratio.latticeRatio.id,
      variant: ratio.placement.variant,
    }));

  const radialPoints = ratios
    .filter(
      (
        ratio,
      ): ratio is PositionedLatticeRatio & {
        placement: Extract<
          PositionedLatticeRatio["placement"],
          { type: "radial" }
        >;
      } => ratio.placement.type === "radial",
    )
    .map((ratio) => ({
      id: ratio.latticeRatio.id,
      variant: ratio.placement.variant,
    }));

  if (cubicPoints.length === ratios.length) {
    return createCubicVisualizationConnections(cubicPoints);
  }

  if (radialPoints.length === ratios.length) {
    return createRadialVisualizationConnections(radialPoints);
  }
  throw new Error(
    "Cannot create connections for mixed lattice visualization types",
  );
}
