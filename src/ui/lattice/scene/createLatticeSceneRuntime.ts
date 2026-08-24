import * as THREE from "three";
import { CameraSystem } from "./CameraSystem";
import { LatticeSceneViewport } from "./LatticeSceneViewport";
import type { LatticeSceneRenderer } from "./LatticeSceneRenderer";

type LatticeSceneSource = Pick<LatticeSceneRenderer, "scene">;

type LatticeSceneRuntimeDependencies = {
  createWebGLRenderer: () => THREE.WebGLRenderer;
  createCameraSystem: (domElement: HTMLElement) => CameraSystem;
  createViewport: (
    container: HTMLElement,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    cameraSystem: CameraSystem,
  ) => LatticeSceneViewport;
};

const defaultDependencies: LatticeSceneRuntimeDependencies = {
  createWebGLRenderer() {
    return new THREE.WebGLRenderer({ antialias: true });
  },

  createCameraSystem(domElement) {
    return new CameraSystem(domElement);
  },

  createViewport(container, renderer, scene, cameraSystem) {
    return new LatticeSceneViewport(container, renderer, scene, cameraSystem);
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
  );

  viewport.start();

  return viewport;
}
