import type { PositionedLatticeRatio } from "../state/createPositionedLatticeRatios";
import { createCubicVisualizationConnections } from "./createCubicVisualizationConnections";
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
      placement: ratio.placement.placement,
    }));

  if (cubicPoints.length === ratios.length) {
    return createCubicVisualizationConnections(cubicPoints);
  }

  if (cubicPoints.length === 0) return [];

  throw new Error(
    "Cannot create connections for mixed lattice visualization types",
  );
}
