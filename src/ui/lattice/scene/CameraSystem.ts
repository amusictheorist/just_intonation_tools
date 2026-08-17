import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class CameraSystem {
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;

  constructor(container: HTMLElement) {
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    this.camera.position.set(10, 6, 14);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, container);

    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  update(): void {
    this.controls.update();
  }

  dispose(): void {
    this.controls.dispose();
  }
}
