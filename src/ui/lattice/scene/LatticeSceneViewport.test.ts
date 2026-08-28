// @vitest-environment jsdom

import * as THREE from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LatticeSceneViewport } from "./LatticeSceneViewport";
import type { LatticePointHover } from "./latticePointHover";
import type { PointerCoordinates } from "./findLatticePointAtPointer";

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
  const canvas = document.createElement("canvas");

  Object.defineProperty(canvas, "parentElement", {
    value: parentElement,
    configurable: true,
  });

  return canvas;
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
  pointMeshes?: readonly THREE.Mesh[];
  onPointHover?: (hover: LatticePointHover) => void;
  onPointRemove?: (pointId: string) => void;
  findPointAtPointer?: (
    event: PointerCoordinates,
    canvas: HTMLCanvasElement,
    camera: THREE.Camera,
    pointMeshes: readonly THREE.Mesh[],
  ) => string | null;
  onFrame?: (deltaSeconds: number) => void;
}) {
  const container = options?.container ?? createTestContainer();
  const canvas = options?.canvas ?? createTestCanvas();
  const renderer = createTestRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const cameraSystem = createTestCameraSystem(camera);

  const pointMeshes = options?.pointMeshes ?? [];

  const viewport = new LatticeSceneViewport(
    container,
    renderer,
    scene,
    cameraSystem,
    {
      getPointMeshes: () => pointMeshes,
      onPointHover: options?.onPointHover,
      onPointRemove: options?.onPointRemove,
      findPointAtPointer: options?.findPointAtPointer,
      onFrame: options?.onFrame,
    },
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

  it("reports the lattice point under the pointer", () => {
    const mesh = new THREE.Mesh();
    const onPointHover = vi.fn();
    const findPointAtPointer = vi.fn(() => "ratio-1");

    const { canvas, camera } = createViewportFixture({
      pointMeshes: [mesh],
      onPointHover,
      findPointAtPointer,
    });

    const event = new PointerEvent("pointermove", {
      clientX: 25,
      clientY: 50,
    });

    canvas.dispatchEvent(event);

    expect(findPointAtPointer).toHaveBeenCalledWith(event, canvas, camera, [
      mesh,
    ]);

    expect(onPointHover).toHaveBeenCalledWith({
      pointId: "ratio-1",
      clientX: 25,
      clientY: 50,
    });
  });

  it("removes the pointer listener when disposed", () => {
    const canvas = createTestCanvas();
    const removeEventListener = vi.spyOn(canvas, "removeEventListener");

    const { viewport } = createViewportFixture({ canvas });

    viewport.dispose();

    expect(removeEventListener).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function),
    );
  });

  it("does not report hovered points after disposal", () => {
    const onPointHover = vi.fn();
    const findPointAtPointer = vi.fn(() => "ratio-1");

    const { canvas, viewport } = createViewportFixture({
      onPointHover,
      findPointAtPointer,
    });

    viewport.dispose();

    canvas.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: 25,
        clientY: 50,
      }),
    );

    expect(findPointAtPointer).not.toHaveBeenCalled();
    expect(onPointHover).not.toHaveBeenCalled();
  });

  it("reports no hovered point when the pointer is not over a lattice point", () => {
    const onPointHover = vi.fn();
    const findPointAtPointer = vi.fn(() => null);

    const { canvas } = createViewportFixture({
      onPointHover,
      findPointAtPointer,
    });

    canvas.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: 25,
        clientY: 50,
      }),
    );

    expect(onPointHover).toHaveBeenCalledWith(null);
  });

  it("reports a lattice point for removal on control-click", () => {
    const mesh = new THREE.Mesh();
    const onPointRemove = vi.fn();
    const findPointAtPointer = vi.fn(() => "ratio-1");

    const { canvas, camera } = createViewportFixture({
      pointMeshes: [mesh],
      onPointRemove,
      findPointAtPointer,
    });

    const event = new PointerEvent("click", {
      clientX: 25,
      clientY: 50,
      ctrlKey: true,
    });

    canvas.dispatchEvent(event);

    expect(findPointAtPointer).toHaveBeenCalledWith(event, canvas, camera, [
      mesh,
    ]);
    expect(onPointRemove).toHaveBeenCalledWith("ratio-1");
  });

  it("reports a lattice point for removal on command-click", () => {
    const mesh = new THREE.Mesh();
    const onPointRemove = vi.fn();
    const findPointAtPointer = vi.fn(() => "ratio-1");

    const { canvas, camera } = createViewportFixture({
      pointMeshes: [mesh],
      onPointRemove,
      findPointAtPointer,
    });

    const event = new PointerEvent("click", {
      clientX: 25,
      clientY: 50,
      metaKey: true,
    });

    canvas.dispatchEvent(event);

    expect(findPointAtPointer).toHaveBeenCalledWith(event, canvas, camera, [
      mesh,
    ]);
    expect(onPointRemove).toHaveBeenCalledWith("ratio-1");
  });

  it("does not remove a lattice point on an unmodified click", () => {
    const onPointRemove = vi.fn();
    const findPointAtPointer = vi.fn(() => "ratio-1");

    const { canvas } = createViewportFixture({
      onPointRemove,
      findPointAtPointer,
    });

    canvas.dispatchEvent(
      new PointerEvent("click", {
        clientX: 25,
        clientY: 50,
      }),
    );

    expect(findPointAtPointer).not.toHaveBeenCalled();
    expect(onPointRemove).not.toHaveBeenCalled();
  });

  it("reports frame delta before rendering", () => {
    let frameCallback: FrameRequestCallback | undefined;

    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frameCallback = callback;
      return 1;
    });

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);

    const onFrame = vi.fn();

    const { viewport, renderer } = createViewportFixture({
      onFrame,
    });

    viewport.start();

    if (!frameCallback) {
      throw new Error("Expected animation frame callback");
    }

    frameCallback(1000);

    if (!frameCallback) {
      throw new Error("Expected next animation frame callback");
    }

    frameCallback(1016);

    expect(onFrame).toHaveBeenLastCalledWith(0.016);

    const onFrameOrder = onFrame.mock.invocationCallOrder.at(-1);
    const renderOrder = vi
      .mocked(renderer.render)
      .mock.invocationCallOrder.at(-1);

    expect(onFrameOrder).toBeDefined();
    expect(renderOrder).toBeDefined();
    expect(onFrameOrder!).toBeLessThan(renderOrder!);
  });
});
