// @vitest-environment jsdom

import * as THREE from "three";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { useLatticeScene } from "./useLatticeScene";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import type { LatticePointHover } from "../scene/latticePointHover";

type HookProps = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
  higherPrimeColor: THREE.ColorRepresentation;
  onPointHover: (hover: LatticePointHover) => void;
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

const onPointHover = vi.fn();
const onPointRemove = vi.fn();

function createTestDependencies() {
  const sceneRenderer = {
    scene: new THREE.Scene(),
    pointMeshes: [] as readonly THREE.Mesh[],
    setScene: vi.fn(),
    setHigherPrimeColor: vi.fn(),
    dispose: vi.fn(),
    update: vi.fn(),
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
        {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
          onPointRemove,
        },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    expect(createSceneRenderer).toHaveBeenCalledWith([], []);

    expect(sceneRenderer.setScene).toHaveBeenCalledWith(
      scenePoints,
      sceneConnections,
    );

    expect(createSceneRuntime).toHaveBeenCalledWith(
      container,
      sceneRenderer,
      expect.objectContaining({
        onPointHover: expect.any(Function),
      }),
    );
  });

  it("does not create a scene runtime without a container", () => {
    const { createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    renderHook(() =>
      useLatticeScene(
        { current: null },
        {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
          onPointRemove,
        },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    expect(createSceneRenderer).not.toHaveBeenCalled();
    expect(createSceneRuntime).not.toHaveBeenCalled();
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
        {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
          onPointRemove,
        },
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
      ({
        scenePoints,
        sceneConnections,
        higherPrimeColor,
        onPointHover,
      }: HookProps) =>
        useLatticeScene(
          containerRef,
          {
            scenePoints,
            sceneConnections,
            higherPrimeColor,
            onPointHover,
            onPointRemove,
          },
          { createSceneRenderer, createSceneRuntime },
        ),
      {
        initialProps: {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
        },
      },
    );

    rerender({
      scenePoints: nextScenePoints,
      sceneConnections: nextSceneConnections,
      higherPrimeColor,
      onPointHover,
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
        {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
          onPointRemove,
        },
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
        {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
          onPointRemove,
        },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    unmount();

    window.dispatchEvent(new Event("resize"));

    expect(sceneRuntime.resize).not.toHaveBeenCalled();
  });

  it("applies the initial higher-prime colour", () => {
    const { sceneRenderer, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    renderHook(() =>
      useLatticeScene(
        { current: container },
        {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
          onPointRemove,
        },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    expect(sceneRenderer.setHigherPrimeColor).toHaveBeenCalledWith(
      higherPrimeColor,
    );
  });

  it("updates the existing renderer when the higher-prime color changes", () => {
    const { sceneRenderer, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    const containerRef = { current: container };

    const { rerender } = renderHook(
      ({
        scenePoints,
        sceneConnections,
        higherPrimeColor,
        onPointHover,
      }: HookProps) =>
        useLatticeScene(
          containerRef,
          {
            scenePoints,
            sceneConnections,
            higherPrimeColor,
            onPointHover,
            onPointRemove,
          },
          { createSceneRenderer, createSceneRuntime },
        ),
      {
        initialProps: {
          scenePoints,
          sceneConnections,
          higherPrimeColor: "#00008b",
          onPointHover,
        },
      },
    );

    rerender({
      scenePoints,
      sceneConnections,
      higherPrimeColor: "purple",
      onPointHover,
    });

    expect(createSceneRenderer).toHaveBeenCalledOnce();
    expect(createSceneRuntime).toHaveBeenCalledOnce();

    expect(sceneRenderer.setHigherPrimeColor).toHaveBeenLastCalledWith(
      "purple",
    );
  });

  it("passes the point-hover callback to the scene runtime", () => {
    const { sceneRenderer, createSceneRenderer, createSceneRuntime } =
      createTestDependencies();

    renderHook(() =>
      useLatticeScene(
        { current: container },
        {
          scenePoints,
          sceneConnections,
          higherPrimeColor,
          onPointHover,
          onPointRemove,
        },
        { createSceneRenderer, createSceneRuntime },
      ),
    );

    expect(createSceneRuntime).toHaveBeenCalledWith(
      container,
      sceneRenderer,
      expect.objectContaining({
        onPointHover: expect.any(Function),
      }),
    );
  });
});
