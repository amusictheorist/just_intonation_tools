import * as THREE from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LatticeSceneRenderer } from "./LatticeSceneRenderer";
import { createLatticeSceneRuntime } from "./createLatticeSceneRuntime";
import type { LatticeSceneViewport } from "./LatticeSceneViewport";
import type { LatticePointHover } from "./latticePointHover";
import type { CameraSystem } from "./CameraSystem";

afterEach(() => {
  vi.unstubAllGlobals();
});

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

    const result = createLatticeSceneRuntime(
      container,
      sceneRenderer,
      {},
      {
        createWebGLRenderer,
        createCameraSystem,
        createViewport,
      },
    );

    expect(createWebGLRenderer).toHaveBeenCalledOnce();
    expect(createCameraSystem).toHaveBeenCalledWith(webGLRenderer.domElement);
    expect(createViewport).toHaveBeenCalledWith(
      container,
      webGLRenderer,
      sceneRenderer.scene,
      cameraSystem,
      expect.objectContaining({
        getPointMeshes: expect.any(Function),
      }),
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

    createLatticeSceneRuntime(
      container,
      sceneRenderer,
      {},
      {
        createWebGLRenderer,
        createCameraSystem,
        createViewport,
      },
    );

    expect(webGLRenderer.setPixelRatio).toHaveBeenCalledWith(2);
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

    createLatticeSceneRuntime(
      container,
      sceneRenderer,
      {},
      {
        createWebGLRenderer,
        createCameraSystem,
        createViewport,
      },
    );

    expect(viewport.start).toHaveBeenCalledOnce();
  });

  it("passes a live point-mesh getter to the viewport", () => {
    const container = {} as HTMLElement;
    const sceneRenderer = new LatticeSceneRenderer([], []);

    const domElement = {} as HTMLCanvasElement;

    const webGLRenderer = {
      domElement,
      setPixelRatio: vi.fn(),
    } as unknown as THREE.WebGLRenderer;

    const cameraSystem = {} as CameraSystem;
    const viewport = {
      start: vi.fn(),
    } as unknown as LatticeSceneViewport;

    const createWebGLRenderer = vi.fn(() => webGLRenderer);
    const createCameraSystem = vi.fn(() => cameraSystem);

    type TestViewportInteractionOptions = {
      getPointMeshes: () => readonly THREE.Mesh[];
      onPointHover?: (hover: LatticePointHover) => void;
      onPointRemove?: (pointId: string) => void;
      onFrame?: (deltaSeconds: number) => void;
    };

    let interactionOptions: TestViewportInteractionOptions | undefined;

    const createViewport = vi.fn(
      (
        ...args: [
          HTMLElement,
          THREE.WebGLRenderer,
          THREE.Scene,
          CameraSystem,
          TestViewportInteractionOptions,
        ]
      ) => {
        interactionOptions = args[4];
        return viewport;
      },
    );

    createLatticeSceneRuntime(
      container,
      sceneRenderer,
      {},
      {
        createWebGLRenderer,
        createCameraSystem,
        createViewport,
      },
    );

    if (!interactionOptions) {
      throw new Error("Expected viewport interaction options");
    }

    const firstMeshes = [new THREE.Mesh()];
    sceneRenderer.pointMeshes = firstMeshes;

    expect(interactionOptions.getPointMeshes()).toBe(firstMeshes);

    const secondMeshes = [new THREE.Mesh(), new THREE.Mesh()];
    sceneRenderer.pointMeshes = secondMeshes;

    expect(interactionOptions.getPointMeshes()).toBe(secondMeshes);
  });

  it("passes the point-hover callback to the viewport", () => {
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

    const onPointHover = vi.fn();

    createLatticeSceneRuntime(
      container,
      sceneRenderer,
      { onPointHover },
      {
        createWebGLRenderer,
        createCameraSystem,
        createViewport,
      },
    );

    expect(createViewport).toHaveBeenCalledWith(
      container,
      webGLRenderer,
      sceneRenderer.scene,
      cameraSystem,
      expect.objectContaining({
        getPointMeshes: expect.any(Function),
        onPointHover,
      }),
    );
  });

  it("updates the scene renderer on each viewport frame", () => {
    const container = {} as HTMLElement;
    const sceneRenderer = new LatticeSceneRenderer([], []);
    const update = vi.spyOn(sceneRenderer, "update");

    const domElement = {} as HTMLCanvasElement;

    const webGLRenderer = {
      domElement,
      setPixelRatio: vi.fn(),
    } as unknown as THREE.WebGLRenderer;

    const cameraSystem = {} as CameraSystem;

    const viewport = {
      start: vi.fn(),
    } as unknown as LatticeSceneViewport;

    const createWebGLRenderer = vi.fn(() => webGLRenderer);
    const createCameraSystem = vi.fn(() => cameraSystem);

    type TestViewportInteractionOptions = {
      getPointMeshes: () => readonly THREE.Mesh[];
      onPointHover?: (hover: LatticePointHover) => void;
      onPointRemove?: (pointId: string) => void;
      onFrame?: (deltaSeconds: number) => void;
    };

    let viewportOptions: TestViewportInteractionOptions | undefined;

    const createViewport = vi.fn(
      (
        ...args: [
          HTMLElement,
          THREE.WebGLRenderer,
          THREE.Scene,
          CameraSystem,
          TestViewportInteractionOptions,
        ]
      ) => {
        viewportOptions = args[4];
        return viewport;
      },
    );

    createLatticeSceneRuntime(
      container,
      sceneRenderer,
      {},
      {
        createWebGLRenderer,
        createCameraSystem,
        createViewport,
      },
    );

    if (!viewportOptions?.onFrame) {
      throw new Error("Expected viewport frame callback");
    }

    viewportOptions.onFrame(0.016);

    expect(update).toHaveBeenCalledWith(0.016);
  });
});
