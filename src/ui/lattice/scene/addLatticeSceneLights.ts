import * as THREE from "three";

/**
 * Adds the default ambient and directional lighting to a lattice scene.
 *
 * @param scene The Three.js scene that receives the lights.
 * @returns Nothing.
 */

export function addLatticeSceneLights(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);
}
