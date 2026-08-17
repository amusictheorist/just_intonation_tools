import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import { LatticeSceneRenderer } from "./LatticeSceneRenderer";
import { createLatticeSceneRuntime } from "./createLatticeSceneRuntime";
import type { LatticeSceneViewport } from "./LatticeSceneViewport";

describe("createLatticeSceneRuntime", () => {
  it("creates the viewport for the lattice scene renderer", () => {
    const container = {} as HTMLElement;
    const sceneRenderer = new LatticeSceneRenderer([], []);

    const domElement = {} as HTMLCanvasElement;

    const webGLRenderer = {
      domElement,
      setPixelRatio: vi.fn(),
    } as unknown as THREE.WebGLRenderer;

    const cameraSystem = {} as never;
    const viewport = {
      start: vi.fn(),
    } as unknown as LatticeSceneViewport;

    const createWebGLRenderer = vi.fn(() => webGLRenderer);
    const createCameraSystem = vi.fn(() => cameraSystem);
    const createViewport = vi.fn(() => viewport);

    const result = createLatticeSceneRuntime(container, sceneRenderer, {
      createWebGLRenderer,
      createCameraSystem,
      createViewport,
    });

    expect(createWebGLRenderer).toHaveBeenCalledOnce();
    expect(createCameraSystem).toHaveBeenCalledWith(webGLRenderer.domElement);
    expect(createViewport).toHaveBeenCalledWith(
      container,
      webGLRenderer,
      sceneRenderer.scene,
      cameraSystem,
    );
    expect(result).toBe(viewport);
  });

  it("caps the renderer pixel ratio at 2", () => {
    vi.stubGlobal("devicePixelRatio", 3);

    const container = {} as HTMLElement;
    const sceneRenderer = new LatticeSceneRenderer([], []);

    const domElement = {} as HTMLCanvasElement;

    const webGLRenderer = {
      domElement,
      setPixelRatio: vi.fn(),
    } as unknown as THREE.WebGLRenderer;

    const cameraSystem = {} as never;
    const viewport = {
      start: vi.fn(),
    } as unknown as LatticeSceneViewport;

    const createWebGLRenderer = vi.fn(() => webGLRenderer);
    const createCameraSystem = vi.fn(() => cameraSystem);
    const createViewport = vi.fn(() => viewport);

    createLatticeSceneRuntime(container, sceneRenderer, {
      createWebGLRenderer,
      createCameraSystem,
      createViewport,
    });

    expect(webGLRenderer.setPixelRatio).toHaveBeenCalledWith(2);

    vi.unstubAllGlobals();
  });

  it("starts the viewport", () => {
    const container = {} as HTMLElement;
    const sceneRenderer = new LatticeSceneRenderer([], []);

    const domElement = {} as HTMLCanvasElement;

    const webGLRenderer = {
      domElement,
      setPixelRatio: vi.fn(),
    } as unknown as THREE.WebGLRenderer;

    const cameraSystem = {} as never;

    const viewport = {
      start: vi.fn(),
    } as unknown as LatticeSceneViewport;

    const createWebGLRenderer = vi.fn(() => webGLRenderer);
    const createCameraSystem = vi.fn(() => cameraSystem);
    const createViewport = vi.fn(() => viewport);

    createLatticeSceneRuntime(container, sceneRenderer, {
      createWebGLRenderer,
      createCameraSystem,
      createViewport,
    });

    expect(viewport.start).toHaveBeenCalledOnce();
  });
});
