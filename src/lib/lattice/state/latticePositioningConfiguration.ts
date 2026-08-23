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
