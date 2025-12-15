import * as THREE from 'three';

export const updatePrimeColor = (manager, colorHex) => {
  const color = new THREE.Color(colorHex);

  manager.points.forEach(point => {
    if (point.userData?.latticeType !== 'prime') return;
    if (!point.material?.color) return;

    point.material.color.copy(color);
    point.material.needsUpdate = true;
  });
};