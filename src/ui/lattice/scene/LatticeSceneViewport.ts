import * as THREE from "three";
import { resizeLatticeViewPort } from "./resizeLatticeViewPort";
import type { CameraSystem } from "./CameraSystem";

type LatticeCameraSystem = Pick<CameraSystem, "camera" | "update" | "dispose">;

export class LatticeSceneViewport {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly cameraSystem: LatticeCameraSystem;
  private animationFrameId: number | null = null;

  constructor(
    container: HTMLElement,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraSystem: LatticeCameraSystem,
  ) {
    this.container = container;
    this.renderer = renderer;
    this.scene = scene;
    this.cameraSystem = cameraSystem;

    this.container.appendChild(this.renderer.domElement);
    this.resize();
  }

  render(): void {
    this.cameraSystem.update();
    this.renderer.render(this.scene, this.cameraSystem.camera);
  }

  resize(): void {
    resizeLatticeViewPort(
      this.container,
      this.renderer,
      this.cameraSystem.camera,
    );
  }

  start(): void {
    this.animationFrameId = requestAnimationFrame(() => {
      this.render();
      this.start();
    });
  }

  stop(): void {
    if (this.animationFrameId === null) return;

    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  dispose(): void {
    this.stop();
    this.cameraSystem.dispose();
    this.renderer.dispose();

    const canvas = this.renderer.domElement;

    if (canvas.parentElement !== this.container) return;

    this.container.removeChild(canvas);
  }
}
