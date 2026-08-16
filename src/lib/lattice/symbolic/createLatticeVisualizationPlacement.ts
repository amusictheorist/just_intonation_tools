import type { Ratio } from "../../ji/ratio";
import type { LatticeVisualization } from "../state/latticeVisualization";
import {
  createCubicVisualizationPlacement,
  type CubicVisualizationPlacement,
} from "./createCubicVisualizationPlacement";
import {
  createRadialVisualizationPlacement,
  type RadialVisualizationPlacement,
} from "./createRadialVisualizationPlacement";

export type LatticeVisualizationPlacement =
  | Readonly<{
      type: "cubic";
      placement: CubicVisualizationPlacement;
    }>
  | Readonly<{
      type: "radial";
      placement: RadialVisualizationPlacement;
    }>;

export function createLatticeVisualizationPlacement(
  ratio: Ratio,
  visualization: LatticeVisualization,
): LatticeVisualizationPlacement | null {
  if (visualization.type === "cubic") {
    const placement = createCubicVisualizationPlacement(
      ratio,
      visualization.includeHigherPrimes,
    );

    if (!placement) return null;

    return {
      type: "cubic",
      placement,
    };
  }

  return {
    type: "radial",
    placement: createRadialVisualizationPlacement(
      ratio,
      visualization.includeLowerOctave,
    ),
  };
}
