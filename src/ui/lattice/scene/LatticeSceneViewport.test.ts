import * as THREE from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LatticeSceneViewport } from "./LatticeSceneViewport";

function createTestContainer(
  overrides: Partial<HTMLElement> = {},
): HTMLElement {
  return {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    clientWidth: 800,
    clientHeight: 400,
    ...overrides,
  } as unknown as HTMLElement;
}

function createTestCanvas(
  parentElement: HTMLElement | null = null,
): HTMLCanvasElement {
  return { parentElement } as unknown as HTMLCanvasElement;
}

function createTestRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  return {
    domElement: canvas,
    render: vi.fn(),
    setSize: vi.fn(),
    dispose: vi.fn(),
  } as unknown as THREE.WebGLRenderer;
}

function createTestCameraSystem(camera: THREE.PerspectiveCamera) {
  return {
    camera,
    update: vi.fn(),
    dispose: vi.fn(),
  };
}

function createViewportFixture(options?: {
  container?: HTMLElement;
  canvas?: HTMLCanvasElement;
}) {
  const container = options?.container ?? createTestContainer();
  const canvas = options?.canvas ?? createTestCanvas();
  const renderer = createTestRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const cameraSystem = createTestCameraSystem(camera);

  const viewport = new LatticeSceneViewport(
    container,
    renderer,
    scene,
    cameraSystem,
  );

  return { container, canvas, renderer, scene, camera, cameraSystem, viewport };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LatticeSceneViewport", () => {
  it("renders the lattice scene with the supplied camera", () => {
    const { viewport, renderer, scene, camera } = createViewportFixture();

    viewport.render();

    expect(renderer.render).toHaveBeenCalledWith(scene, camera);
  });

  it("resizes the renderer and camera for its container", () => {
    const container = createTestContainer({
      clientWidth: 800,
      clientHeight: 400,
    });

    const { viewport, renderer, camera } = createViewportFixture({ container });

    viewport.resize();

    expect(renderer.setSize).toHaveBeenCalledWith(800, 400);
    expect(camera.aspect).toBe(2);
  });

  it("updates camera controls before rendering", () => {
    const { viewport, renderer, scene, camera, cameraSystem } =
      createViewportFixture();

    viewport.render();

    expect(cameraSystem.update).toHaveBeenCalledOnce();
    expect(renderer.render).toHaveBeenCalledWith(scene, camera);
  });

  it("disposes the camera system", () => {
    const { viewport, cameraSystem } = createViewportFixture();

    viewport.dispose();

    expect(cameraSystem.dispose).toHaveBeenCalledOnce();
  });

  it("disposes the renderer", () => {
    const { viewport, renderer } = createViewportFixture();

    viewport.dispose();

    expect(renderer.dispose).toHaveBeenCalledOnce();
  });

  it("removes the renderer canvas from the container when disposed", () => {
    const container = createTestContainer();
    const canvas = createTestCanvas(container);
    const { viewport } = createViewportFixture({ container, canvas });

    viewport.dispose();

    expect(container.removeChild).toHaveBeenCalledWith(canvas);
  });

  it("attaches the renderer canvas to the container", () => {
    const container = createTestContainer();
    const canvas = createTestCanvas();

    createViewportFixture({ container, canvas });

    expect(container.appendChild).toHaveBeenCalledWith(canvas);
  });

  it("sizes the renderer and camera when created", () => {
    const container = createTestContainer({
      clientWidth: 800,
      clientHeight: 400,
    });

    const { renderer, camera } = createViewportFixture({ container });

    expect(renderer.setSize).toHaveBeenCalledWith(800, 400);
    expect(camera.aspect).toBe(2);
  });

  it("renders on an animation frame after starting", () => {
    let frameCallback: FrameRequestCallback | undefined;

    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frameCallback = callback;
      return 1;
    });

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);

    const { viewport, renderer, scene, camera } = createViewportFixture();

    viewport.start();

    if (!frameCallback) {
      throw new Error("Expected animation frame callback");
    }

    frameCallback(0);

    expect(renderer.render).toHaveBeenCalledWith(scene, camera);
  });

  it("continues scheduling animation frames after starting", () => {
    let frameCallback: FrameRequestCallback | undefined;

    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frameCallback = callback;
      return 1;
    });

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);

    const { viewport } = createViewportFixture();

    viewport.start();

    expect(requestAnimationFrame).toHaveBeenCalledOnce();

    if (!frameCallback) {
      throw new Error("Expected animation frame callback");
    }

    frameCallback(0);

    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it("cancels the scheduled animation frame when stopped", () => {
    const requestAnimationFrame = vi.fn(() => 42);
    const cancelAnimationFrame = vi.fn();

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);

    const { viewport } = createViewportFixture();

    viewport.start();
    viewport.stop();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });

  it("stops the animation loop when disposed", () => {
    const requestAnimationFrame = vi.fn(() => 42);
    const cancelAnimationFrame = vi.fn();

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);

    const { viewport } = createViewportFixture();

    viewport.start();
    viewport.dispose();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });
});
