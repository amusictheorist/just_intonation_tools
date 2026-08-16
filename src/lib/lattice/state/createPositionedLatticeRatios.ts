import type { Vector3 } from "../geometry/createRadialDirectionVector";
import { createLatticeVisualizationPosition } from "../geometry/createLatticeVisualizationPosition";
import { createCubicVisualizationPlacement } from "../symbolic/createCubicVisualizationPlacement";
import type { LatticeRatio } from "./latticeRatio";
import { createRadialVisualizationPlacement } from "../symbolic/createRadialVisualizationPlacement";
import type { LatticePositioningConfiguration } from "./latticePositioningConfiguration";
import type { LatticeVisualizationPlacement } from "../symbolic/createLatticeVisualizationPlacement";

export type PositionedLatticeRatio = Readonly<{
  latticeRatio: LatticeRatio;
  placement: LatticeVisualizationPlacement;
  position: Vector3;
}>;

export function createPositionedLatticeRatios(
  ratios: readonly LatticeRatio[],
  configuration: LatticePositioningConfiguration,
): readonly PositionedLatticeRatio[] {
  const positionedRatios: PositionedLatticeRatio[] = [];

  if (
    configuration.visualization.type === "cubic" &&
    configuration.geometry.type === "cubic"
  ) {
    for (const latticeRatio of ratios) {
      const placement = createCubicVisualizationPlacement(
        latticeRatio.ratio,
        configuration.visualization.includeHigherPrimes,
      );

      if (!placement) {
        continue;
      }

      const visualizationPlacement: LatticeVisualizationPlacement = {
        type: "cubic",
        placement,
      };

      positionedRatios.push({
        latticeRatio,
        placement: visualizationPlacement,
        position: createLatticeVisualizationPosition({
          placement: {
            type: "cubic",
            placement,
          },
          geometry: configuration.geometry,
        }),
      });
    }

    return positionedRatios;
  }

  if (
    configuration.visualization.type === "radial" &&
    configuration.geometry.type === "radial"
  ) {
    for (const latticeRatio of ratios) {
      const placement = createRadialVisualizationPlacement(
        latticeRatio.ratio,
        configuration.visualization.includeLowerOctave,
      );

      const visualizationPlacement: LatticeVisualizationPlacement = {
        type: "radial",
        placement,
      };

      positionedRatios.push({
        latticeRatio,
        placement: visualizationPlacement,
        position: createLatticeVisualizationPosition({
          placement: { type: "radial", placement },
          geometry: configuration.geometry,
        }),
      });
    }

    return positionedRatios;
  }

  throw new Error("Mismatched lattice positioning configuration");
}
