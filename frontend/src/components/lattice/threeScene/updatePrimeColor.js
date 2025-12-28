import * as THREE from 'three';

export const updatePrimeColor = (manager, colorHex) => {
  const color = new THREE.Color(colorHex);

  manager.points.forEach(point => {
    const isHighPrime = point.userData.latticeType === 'prime';
    if (isHighPrime && point.material?.color) {
      point.material.color.copy(color);
      point.material.needsUpdate = true;
    }
  });
};