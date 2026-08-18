// @vitest-environment jsdom
import * as THREE from "three";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { useLatticeScene } from "./useLatticeScene";

type HookProps = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
};

const container = {} as HTMLDivElement;

const scenePoints = [
  {
    id: "ratio-1",
    position: { x: 1, y: 0, z: 0 },
  },
] satisfies readonly LatticeScenePoint[];

const sceneConnections: readonly LatticeSceneConnection[] = [];

function createTestDependencies() {
  const sceneRenderer = {
    scene: new THREE.Scene(),
    setScene: vi.fn(),
    dispose: vi.fn(),
  };

  const sceneRuntime = {
    dispose: vi.fn(),
    resize: vi.fn(),
  };

  const createSceneRenderer = vi.fn(() => sceneRenderer);
  const createSceneRuntime = vi.fn(() => sceneRuntime);

  return {
    sceneRenderer,
    sceneRuntime,
    createSceneRenderer,
    createSceneRuntime,
  };
}

describe("useLatticeScene", () => {
  it("creates the lattice scene runtime for the supplied scene data", () => {
    const { sceneRenderer, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    renderHook(() =>
      useLatticeScene(
        { current: container },
        { scenePoints, sceneConnections },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    expect(createSceneRenderer).toHaveBeenCalledWith([], []);

    expect(sceneRenderer.setScene).toHaveBeenCalledWith(
      scenePoints,
      sceneConnections,
    );

    expect(createSceneRuntime).toHaveBeenCalledWith(container, sceneRenderer);
  });

  it("disposes the scene runtime and renderer on unmount", () => {
    const {
      sceneRenderer,
      sceneRuntime,
      createSceneRenderer,
      createSceneRuntime,
    } = createTestDependencies();

    const { unmount } = renderHook(() =>
      useLatticeScene(
        { current: container },
        { scenePoints, sceneConnections },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    unmount();

    expect(sceneRuntime.dispose).toHaveBeenCalledOnce();
    expect(sceneRenderer.dispose).toHaveBeenCalledOnce();
  });

  it("updates the existing scene renderer when scene data changes", () => {
    const { sceneRenderer, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    const containerRef = { current: container };

    const nextScenePoints = [
      {
        id: "ratio-2",
        position: { x: 0, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeScenePoint[];

    const nextSceneConnections = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        fromPosition: { x: 1, y: 0, z: 0 },
        toPosition: { x: 0, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeSceneConnection[];

    const { rerender } = renderHook(
      ({ scenePoints, sceneConnections }: HookProps) =>
        useLatticeScene(
          containerRef,
          { scenePoints, sceneConnections },
          { createSceneRenderer, createSceneRuntime },
        ),
      {
        initialProps: {
          scenePoints,
          sceneConnections,
        },
      },
    );

    rerender({
      scenePoints: nextScenePoints,
      sceneConnections: nextSceneConnections,
    });

    expect(createSceneRenderer).toHaveBeenCalledOnce();
    expect(createSceneRuntime).toHaveBeenCalledOnce();

    expect(sceneRenderer.setScene).toHaveBeenCalledWith(
      nextScenePoints,
      nextSceneConnections,
    );
  });

  it("resizes the existing scene runtime when the window resizes", () => {
    const { sceneRuntime, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    const containerRef = { current: container };

    const { unmount } = renderHook(() =>
      useLatticeScene(
        containerRef,
        { scenePoints, sceneConnections },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    window.dispatchEvent(new Event("resize"));

    expect(sceneRuntime.resize).toHaveBeenCalledOnce();

    unmount();
  });

  it("removes the resize listener on unmount", () => {
    const { sceneRuntime, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    const containerRef = { current: container };

    const { unmount } = renderHook(() =>
      useLatticeScene(
        containerRef,
        { scenePoints, sceneConnections },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    unmount();

    window.dispatchEvent(new Event("resize"));

    expect(sceneRuntime.resize).not.toHaveBeenCalled();
  });
});
