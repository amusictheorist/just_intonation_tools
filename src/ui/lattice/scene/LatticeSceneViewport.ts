import * as THREE from "three";
import { resizeLatticeViewPort } from "./resizeLatticeViewPort";
import type { CameraSystem } from "./CameraSystem";
import {
  findLatticePointAtPointer,
  type PointerCoordinates,
} from "./findLatticePointAtPointer";
import type { LatticePointHover } from "./latticePointHover";

type LatticeCameraSystem = Pick<CameraSystem, "camera" | "update" | "dispose">;

type LatticePointPicker = (
  event: PointerCoordinates,
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  pointMeshes: readonly THREE.Mesh[],
) => string | null;

type LatticePointHoverHandler = (hover: LatticePointHover) => void;

type LatticeSceneViewportInteractionOptions = Readonly<{
  getPointMeshes?: () => readonly THREE.Mesh[];
  onPointHover?: LatticePointHoverHandler;
  onPointRemove?: (pointId: string) => void;
  findPointAtPointer?: LatticePointPicker;
}>;

/**
 * Manages the WebGL viewport and animation lifecycle for a lattice scene.
 */

export class LatticeSceneViewport {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly cameraSystem: LatticeCameraSystem;
  private animationFrameId: number | null = null;
  private readonly getPointMeshes: () => readonly THREE.Mesh[];
  private readonly onPointHover: LatticePointHoverHandler | undefined;
  private readonly onPointRemove: ((pointId: string) => void) | undefined;
  private readonly findPointAtPointer: LatticePointPicker;

  constructor(
    container: HTMLElement,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraSystem: LatticeCameraSystem,
    interactionOptions: LatticeSceneViewportInteractionOptions = {},
  ) {
    this.container = container;
    this.renderer = renderer;
    this.scene = scene;
    this.cameraSystem = cameraSystem;

    this.getPointMeshes = interactionOptions.getPointMeshes ?? (() => []);
    this.onPointHover = interactionOptions.onPointHover;
    this.onPointRemove = interactionOptions.onPointRemove;
    this.findPointAtPointer =
      interactionOptions.findPointAtPointer ?? findLatticePointAtPointer;

    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.addEventListener(
      "pointermove",
      this.handlePointerMove,
    );
    this.renderer.domElement.addEventListener("click", this.handleClick);

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

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (!this.onPointHover) return;

    const pointId = this.findPointAtPointer(
      event,
      this.renderer.domElement,
      this.cameraSystem.camera,
      this.getPointMeshes(),
    );

    if (!pointId) {
      this.onPointHover(null);
      return;
    }

    this.onPointHover({
      pointId,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  };

  private readonly handleClick = (event: MouseEvent): void => {
    if (!this.onPointRemove) return;
    if (!event.ctrlKey && !event.metaKey) return;

    const pointId = this.findPointAtPointer(
      event,
      this.renderer.domElement,
      this.cameraSystem.camera,
      this.getPointMeshes(),
    );

    if (!pointId) return;

    this.onPointRemove(pointId);
  };

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

    this.renderer.domElement.removeEventListener(
      "pointermove",
      this.handlePointerMove,
    );
    this.renderer.domElement.removeEventListener("click", this.handleClick);

    this.cameraSystem.dispose();
    this.renderer.dispose();

    const canvas = this.renderer.domElement;

    if (canvas.parentElement !== this.container) return;

    this.container.removeChild(canvas);
  }
}
