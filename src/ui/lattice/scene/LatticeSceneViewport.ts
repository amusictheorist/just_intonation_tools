import * as THREE from "three";
import { resizeLatticeViewPort } from "./resizeLatticeViewPort";
import type { CameraSystem } from "./CameraSystem";

type LatticeCameraSystem = Pick<CameraSystem, "camera" | "update" | "dispose">;

/**
 * Manages the WebGL viewport and animation lifecycle for a lattice scene.
 */

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

  /**
   * Renders one frame of the current lattice scene.
   *
   * @returns Nothing.
   */

  render(): void {
    this.cameraSystem.update();
    this.renderer.render(this.scene, this.cameraSystem.camera);
  }

  /**
   * Resizes the renderer and camera to match the viewport container.
   *
   * @returns Nothing.
   */

  resize(): void {
    resizeLatticeViewPort(
      this.container,
      this.renderer,
      this.cameraSystem.camera,
    );
  }

  /**
   * Starts the request-animation-frame render loop.
   *
   * @returns Nothing.
   */

  start(): void {
    this.animationFrameId = requestAnimationFrame(() => {
      this.render();
      this.start();
    });
  }

  /**
   * Stops the active animation-frame render loop.
   *
   * @returns Nothing.
   */

  stop(): void {
    if (this.animationFrameId === null) return;

    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  /**
   * Stops rendering and disposes the camera system and WebGL renderer.
   *
   * The renderer canvas is removed when it is still owned by this viewport's
   * container.
   *
   * @returns Nothing.
   */

  dispose(): void {
    this.stop();
    this.cameraSystem.dispose();
    this.renderer.dispose();

    const canvas = this.renderer.domElement;

    if (canvas.parentElement !== this.container) return;

    this.container.removeChild(canvas);
  }
}
