import type { Ratio } from "../../ji/ratio/ratio";
import type { LatticeVisualization } from "../state/latticeVisualization";
import {
  createCubicVisualizationVariant,
  type CubicVisualizationVariant,
} from "./createCubicVisualizationVariant";
import {
  createRadialVisualizationVariant,
  type RadialVisualizationVariant,
} from "./createRadialVisualizationVariant";

/**
 * Symbolic placement for one ratio within the selected visualization family.
 *
 * The outer type distinguishes cubic from radial visualization, while the nested variant distinguishes the standard and expanded representation within that family.
 */

export type LatticeVisualizationPlacement =
  | Readonly<{
      type: "cubic";
      variant: CubicVisualizationVariant;
    }>
  | Readonly<{
      type: "radial";
      variant: RadialVisualizationVariant;
    }>;

export function createLatticeVisualizationPlacement(
  ratio: Ratio,
  visualization: LatticeVisualization,
): LatticeVisualizationPlacement | null {
  if (visualization.type === "cubic") {
    const variant = createCubicVisualizationVariant(
      ratio,
      visualization.includeHigherPrimes,
    );

    if (!variant) return null;

    return {
      type: "cubic",
      variant,
    };
  }

  return {
    type: "radial",
    variant: createRadialVisualizationVariant(
      ratio,
      visualization.includeLowerOctave,
    ),
  };
}
