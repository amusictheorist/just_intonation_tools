import * as THREE from "three";
import type { LatticeSceneManager } from "./types";

export const updatePrimeColor = (
  manager: LatticeSceneManager,
  colorValue: string,
): void => {
  const color = new THREE.Color(colorValue);

  for (const point of manager.points) {
    if (point.userData.latticeType !== "prime") continue;

    point.material.color.copy(color);
    point.material.needsUpdate = true;
  }
};
