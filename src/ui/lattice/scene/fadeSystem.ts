import type * as THREE from "three";
import type {
  ConnectionLine,
  LatticePointMesh,
  RemovableLatticePoint,
} from "./types";

const FADE_STEP = 0.05;

export const fadeInPoints = (points: LatticePointMesh[]): void => {
  for (const point of points) {
    point.material.opacity = Math.min(1, point.material.opacity + FADE_STEP);

    const labelSprite = point.userData.labelSprite;

    if (labelSprite) {
      labelSprite.material.opacity = Math.min(
        1,
        labelSprite.material.opacity + FADE_STEP,
      );
    }
  }
};

export const fadeInLines = (lines: ConnectionLine[]): void => {
  for (const line of lines) {
    line.material.opacity = Math.min(1, line.material.opacity + FADE_STEP);
  }
};

export const fadeOutRemoving = (
  toRemove: RemovableLatticePoint[],
  scene: THREE.Scene,
): void => {
  for (let index = toRemove.length - 1; index >= 0; index -= 1) {
    const point = toRemove[index];

    point.material.opacity -= FADE_STEP;

    const labelSprite = point.userData.labelSprite;

    if (labelSprite) {
      labelSprite.material.opacity -= FADE_STEP;
    }

    if (point.material.opacity > 0) continue;

    scene.remove(point);
    point.geometry.dispose();
    point.material.dispose();

    if (labelSprite) {
      scene.remove(labelSprite);
      labelSprite.material.map?.dispose();
      labelSprite.material.dispose();
    }

    toRemove.splice(index, 1);
  }
};
