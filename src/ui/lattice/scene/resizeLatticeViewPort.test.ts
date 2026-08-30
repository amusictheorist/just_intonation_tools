import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import { resizeLatticeViewPort } from "./resizeLatticeViewPort";

describe("resizeLatticeViewPort", () => {
  it("resizes the renderer and updates the camera aspect ratio", () => {
    const container = {
      clientWidth: 800,
      clientHeight: 400,
    } as HTMLElement;

    const renderer = {
      setSize: vi.fn(),
    } as unknown as THREE.WebGLRenderer;

    const camera = new THREE.PerspectiveCamera();
    const updateProjectionMatrix = vi.spyOn(camera, "updateProjectionMatrix");

    resizeLatticeViewPort(container, renderer, camera);

    expect(renderer.setSize).toHaveBeenCalledWith(800, 400);
    expect(camera.aspect).toBe(2);
    expect(updateProjectionMatrix).toHaveBeenCalledOnce();
  });

  it("does nothing when the container has no renderable size", () => {
    const container = {
      clientWidth: 0,
      clientHeight: 400,
    } as HTMLElement;

    const renderer = {
      setSize: vi.fn(),
    } as unknown as THREE.WebGLRenderer;

    const camera = new THREE.PerspectiveCamera();
    const updateProjectionMatrix = vi.spyOn(camera, "updateProjectionMatrix");

    const initialAspect = camera.aspect;

    resizeLatticeViewPort(container, renderer, camera);

    expect(renderer.setSize).not.toHaveBeenCalled();
    expect(camera.aspect).toBe(initialAspect);
    expect(updateProjectionMatrix).not.toHaveBeenCalled();
  });
});
