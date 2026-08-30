import * as THREE from "three";

/**
 * Resizes the lattice renderer and camera to match their container.
 *
 * Containers without a renderable width or height are ignored.
 *
 * @param container The DOM element whose dimensions determine the viewport size.
 * @param renderer The Three.js renderer to resize.
 * @param camera The perspective camera whose aspect ratio should be updated.
 * @returns Nothing.
 */

export function resizeLatticeViewPort(
  container: HTMLElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
): void {
  const width = container.clientWidth;
  const height = container.clientHeight;

  if (width === 0 || height === 0) return;

  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
