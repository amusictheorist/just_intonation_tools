import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Owns the lattice camera and its interactive orbit controls.
 */

export class CameraSystem {
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;

  constructor(domElement: HTMLElement) {
    this.camera = new THREE.PerspectiveCamera(
      45,
      domElement.clientWidth / domElement.clientHeight,
      0.1,
      1000,
    );

    this.camera.position.set(10, 6, 14);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, domElement);

    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  /**
   * Updates the camera controls for the current frame.
   *
   * @returns Nothing.
   */

  update(): void {
    this.controls.update();
  }

  /**
   * Disposes the interactive camera controls.
   *
   * @returns Nothing.
   */

  dispose(): void {
    this.controls.dispose();
  }
}
