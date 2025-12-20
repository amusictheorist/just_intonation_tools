import { SPACING } from "../utils/math/constants";
import { placeRatio } from "../utils/placement/index";

export const updatePoints = (manager, ratios, mode, controls) => {
  manager.points.forEach(point => {
    const r = point.userData;
    if (!r?.canonical) return;

    const coords = placeRatio(r, mode, controls);
    if (!coords) return;

    point.position.set(
      coords.x * SPACING,
      coords.y * SPACING,
      coords.z * SPACING
    );

    if (point.userData.labelSprite) {
      point.userData.labelSprite.position.set(
        coords.x * SPACING,
        coords.y * SPACING + 0.4,
        coords.z * SPACING
      );
    }
  });

  manager.connections.update();
};