import { SPACING } from "../../../lib/lattice/math/constants";
import { placeRatio } from "../../../lib/lattice/placement/placementIndex";
import type {
  LatticeControls,
  PlacementMode,
  Ratio,
} from "../../../lib/lattice/types";
import type { LatticePointData, LatticeSceneManager } from "./types";

const isRatioPoint = (
  data: LatticePointData,
): data is LatticePointData & Ratio =>
  data.valid === true &&
  data.canonical !== undefined &&
  data.octave !== undefined;

export const updatePoints = (
  manager: LatticeSceneManager,
  mode: PlacementMode,
  controls: LatticeControls,
): void => {
  for (const point of manager.points) {
    if (!isRatioPoint(point.userData)) continue;

    const coordinates = placeRatio(point.userData, mode, controls);

    if (!coordinates) continue;

    point.position.set(
      coordinates.x * SPACING,
      coordinates.y * SPACING,
      coordinates.z * SPACING,
    );

    const labelSprite = point.userData.labelSprite;

    if (labelSprite) {
      labelSprite.position.set(
        coordinates.x * SPACING,
        coordinates.y * SPACING + 0.4,
        coordinates.z * SPACING,
      );
    }
  }

  manager.connections.update();
};
