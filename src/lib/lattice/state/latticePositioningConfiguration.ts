import {
  DEFAULT_CUBIC_ROTATION,
  DEFAULT_HIGHER_PRIME_RADIUS,
} from "../geometry/latticeGeometryConstants";
import type { LatticeGeometry } from "./latticeGeometry";
import type { LatticeVisualization } from "./latticeVisualization";

/**
 * Pairs visualization settings with geometry settings from the same lattice family.
 */

export type LatticePositioningConfiguration =
  | Readonly<{
      visualization: Extract<LatticeVisualization, { type: "cubic" }>;
      geometry: Extract<LatticeGeometry, { type: "cubic" }>;
    }>
  | Readonly<{
      visualization: Extract<LatticeVisualization, { type: "radial" }>;
      geometry: Extract<LatticeGeometry, { type: "radial" }>;
    }>;

export const DEFAULT_CUBIC_POSITIONING_CONFIGURATION: LatticePositioningConfiguration =
  {
    visualization: {
      type: "cubic",
      includeHigherPrimes: false,
    },
    geometry: {
      type: "cubic",
      higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
      higherPrimeRotation: DEFAULT_CUBIC_ROTATION,
    },
  };

export const DEFAULT_RADIAL_POSITIONING_CONFIGURATION: LatticePositioningConfiguration =
  {
    visualization: {
      type: "radial",
      includeLowerOctave: false,
    },
    geometry: {
      type: "radial",
      includeGeneratorHeight: true,
      lowerSymmetry: "continuous",
    },
  };
