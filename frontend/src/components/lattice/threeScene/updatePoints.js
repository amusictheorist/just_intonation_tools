import { placeRatio } from "../placement";

export const updatePoints = (manager, ratios, mode, controls) => {
  const SPACING = 2;

  manager.points.forEach(point => {
    const r = point.userData?.ratio;
    if (!r) return;

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
};