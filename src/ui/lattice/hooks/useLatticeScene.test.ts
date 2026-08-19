// @vitest-environment jsdom
import * as THREE from "three";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { useLatticeScene } from "./useLatticeScene";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";

type HookProps = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
  higherPrimeColor: THREE.ColorRepresentation;
};

const container = {} as HTMLDivElement;

const ratio = createTestRatio(3n, 2n);

const scenePoints = [
  {
    id: "ratio-1",
    rawInput: "3/2",
    ratio,
    labelRatio: ratio,
    position: { x: 1, y: 0, z: 0 },
    hasHigherPrimeFactors: false,
    radialSide: null,
  },
] satisfies readonly LatticeScenePoint[];

const sceneConnections: readonly LatticeSceneConnection[] = [];

const higherPrimeColor: THREE.ColorRepresentation = "#00008b";

function createTestDependencies() {
  const sceneRenderer = {
    scene: new THREE.Scene(),
    setScene: vi.fn(),
    setHigherPrimeColor: vi.fn(),
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
        { scenePoints, sceneConnections, higherPrimeColor },
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
        { scenePoints, sceneConnections, higherPrimeColor },
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

    const nextRatio = createTestRatio(5n, 4n);

    const nextScenePoints = [
      {
        id: "ratio-2",
        rawInput: "5/4",
        ratio: nextRatio,
        labelRatio: nextRatio,
        position: { x: 0, y: 1, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
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
          { scenePoints, sceneConnections, higherPrimeColor },
          { createSceneRenderer, createSceneRuntime },
        ),
      {
        initialProps: {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
        },
      },
    );

    rerender({
      scenePoints: nextScenePoints,
      sceneConnections: nextSceneConnections,
      higherPrimeColor,
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
        { scenePoints, sceneConnections, higherPrimeColor },
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
        { scenePoints, sceneConnections, higherPrimeColor },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    unmount();

    window.dispatchEvent(new Event("resize"));

    expect(sceneRuntime.resize).not.toHaveBeenCalled();
  });

  it("updates the existing renderer when the higher-prime color changes", () => {
    const { sceneRenderer, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    const containerRef = { current: container };

    const { rerender } = renderHook(
      ({ scenePoints, sceneConnections, higherPrimeColor }: HookProps) =>
        useLatticeScene(
          containerRef,
          { scenePoints, sceneConnections, higherPrimeColor },
          { createSceneRenderer, createSceneRuntime },
        ),
      {
        initialProps: {
          scenePoints,
          sceneConnections,
          higherPrimeColor: "#00008b",
        },
      },
    );

    rerender({ scenePoints, sceneConnections, higherPrimeColor: "purple" });

    expect(createSceneRenderer).toHaveBeenCalledOnce();
    expect(createSceneRuntime).toHaveBeenCalledOnce();

    expect(sceneRenderer.setHigherPrimeColor).toHaveBeenLastCalledWith(
      "purple",
    );
  });
});
