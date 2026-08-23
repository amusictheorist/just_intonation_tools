import type { Vector3 } from "../geometry/createRadialDirectionVector";
import { createLatticeVisualizationPosition } from "../geometry/createLatticeVisualizationPosition";
import type { LatticeRatio } from "./latticeRatio";
import type { LatticePositioningConfiguration } from "./latticePositioningConfiguration";
import type { LatticeVisualizationPlacement } from "../symbolic/createLatticeVisualizationPlacement";
import { createCubicVisualizationVariant } from "../symbolic/createCubicVisualizationVariant";
import { createRadialVisualizationVariant } from "../symbolic/createRadialVisualizationVariant";

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
      const variant = createCubicVisualizationVariant(
        latticeRatio.ratio,
        configuration.visualization.includeHigherPrimes,
      );

      if (!variant) continue;

      const placement: LatticeVisualizationPlacement = {
        type: "cubic",
        variant,
      };

      positionedRatios.push({
        latticeRatio,
        placement,
        position: createLatticeVisualizationPosition({
          placement,
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
      const variant = createRadialVisualizationVariant(
        latticeRatio.ratio,
        configuration.visualization.includeLowerOctave,
      );

      const placement: LatticeVisualizationPlacement = {
        type: "radial",
        variant,
      };

      positionedRatios.push({
        latticeRatio,
        placement,
        position: createLatticeVisualizationPosition({
          placement,
          geometry: configuration.geometry,
        }),
      });
    }

    return positionedRatios;
  }

  throw new Error("Mismatched lattice positioning configuration");
}
