import * as THREE from "three";
import { CameraSystem } from "./CameraSystem";
import { LatticeSceneViewport } from "./LatticeSceneViewport";
import type { LatticeSceneRenderer } from "./LatticeSceneRenderer";
import type { LatticePointHover } from "./latticePointHover";

type LatticeSceneSource = Pick<
  LatticeSceneRenderer,
  "scene" | "pointMeshes" | "update"
>;

type LatticeSceneRuntimeInteractionOptions = Readonly<{
  onPointHover?: (hover: LatticePointHover) => void;
  onPointRemove?: (pointId: string) => void;
}>;

type LatticeSceneRuntimeDependencies = {
  createWebGLRenderer: () => THREE.WebGLRenderer;
  createCameraSystem: (domElement: HTMLElement) => CameraSystem;
  createViewport: (
    container: HTMLElement,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraSystem: CameraSystem,
    interactionOptions: {
      getPointMeshes: () => readonly THREE.Mesh[];
      onPointHover?: (hover: LatticePointHover) => void;
      onPointRemove?: (pointId: string) => void;
      onFrame?: (deltaSeconds: number) => void;
    },
  ) => LatticeSceneViewport;
};

const defaultDependencies: LatticeSceneRuntimeDependencies = {
  createWebGLRenderer() {
    return new THREE.WebGLRenderer({ antialias: true });
  },

  createCameraSystem(domElement) {
    return new CameraSystem(domElement);
  },

  createViewport(container, renderer, scene, cameraSystem, interactionOptions) {
    return new LatticeSceneViewport(
      container,
      renderer,
      scene,
      cameraSystem,
      interactionOptions,
    );
  },
};

/**
 * Creates and starts the Three.js runtime for a lattice scene.
 *
 * The renderer pixel ratio is capped to limit rendering cost on high-density displays.
 *
 * @param container The DOM container that owns the lattice viewport.
 * @param sceneRenderer The source of the Three.js scene to render.
 * @param dependencies Factories used to create the renderer, camera system, and viewport.
 * @returns The started lattice scene viewport.
 */

export function createLatticeSceneRuntime(
  container: HTMLElement,
  sceneRenderer: LatticeSceneSource,
  interactionOptions: LatticeSceneRuntimeInteractionOptions = {},
  dependencies: LatticeSceneRuntimeDependencies = defaultDependencies,
): LatticeSceneViewport {
  const renderer = dependencies.createWebGLRenderer();

  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2));

  const cameraSystem = dependencies.createCameraSystem(renderer.domElement);

  const viewport = dependencies.createViewport(
    container,
    renderer,
    sceneRenderer.scene,
    cameraSystem,
    {
      getPointMeshes: () => sceneRenderer.pointMeshes,
      onPointHover: interactionOptions.onPointHover,
      onPointRemove: interactionOptions.onPointRemove,
      onFrame: (deltaSeconds) => sceneRenderer.update(deltaSeconds),
    },
  );

  viewport.start();

  return viewport;
}
