import * as THREE from "three";
import { useEffect, useRef, type RefObject } from "react";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { createLatticeSceneRuntime } from "../scene/createLatticeSceneRuntime";
import { LatticeSceneRenderer } from "../scene/LatticeSceneRenderer";
import type { LatticeSceneViewport } from "../scene/LatticeSceneViewport";

type UseLatticeSceneOptions = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
  higherPrimeColor: THREE.ColorRepresentation;
};

type LatticeSceneRendererHandle = Pick<
  LatticeSceneRenderer,
  "scene" | "setScene" | "setHigherPrimeColor" | "dispose"
>;

type LatticeSceneRuntimeHandle = Pick<
  LatticeSceneViewport,
  "resize" | "dispose"
>;

type UseLatticeSceneDependencies = {
  createSceneRenderer: (
    scenePoints: readonly LatticeScenePoint[],
    sceneConnections: readonly LatticeSceneConnection[],
  ) => LatticeSceneRendererHandle;
  createSceneRuntime: (
    container: HTMLElement,
    sceneRenderer: LatticeSceneRendererHandle,
  ) => LatticeSceneRuntimeHandle;
};

const defaultDependencies: UseLatticeSceneDependencies = {
  createSceneRenderer(scenePoints, sceneConnections) {
    return new LatticeSceneRenderer(scenePoints, sceneConnections);
  },

  createSceneRuntime(container, sceneRenderer) {
    return createLatticeSceneRuntime(container, sceneRenderer);
  },
};

/**
 * Owns the lifecycle of the Three.js lattice scene and synchronizes it with current scene data and appearance settings.
 *
 * @param containerRef The DOM container in which the lattice viewport is created.
 * @param options The current scene points, scene connections, and appearance settings.
 * @param dependencies Factories used to create the scene renderer and runtime.
 * @returns Nothing.
 */

export function useLatticeScene(
  containerRef: RefObject<HTMLDivElement | null>,
  { scenePoints, sceneConnections, higherPrimeColor }: UseLatticeSceneOptions,
  dependencies: UseLatticeSceneDependencies = defaultDependencies,
): void {
  const { createSceneRenderer, createSceneRuntime } = dependencies;

  const sceneRendererRef = useRef<LatticeSceneRendererHandle | null>(null);
  const sceneRuntimeRef = useRef<LatticeSceneRuntimeHandle | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const sceneRenderer = createSceneRenderer([], []);

    const sceneRuntime = createSceneRuntime(container, sceneRenderer);

    sceneRendererRef.current = sceneRenderer;
    sceneRuntimeRef.current = sceneRuntime;

    function handleResize(): void {
      sceneRuntime.resize();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      sceneRuntime.dispose();
      sceneRenderer.dispose();

      sceneRuntimeRef.current = null;
      sceneRendererRef.current = null;
    };
  }, [containerRef, createSceneRenderer, createSceneRuntime]);

  useEffect(() => {
    const sceneRenderer = sceneRendererRef.current;

    if (!sceneRenderer) return;

    sceneRenderer.setScene(scenePoints, sceneConnections);
  }, [scenePoints, sceneConnections]);

  useEffect(() => {
    const sceneRenderer = sceneRendererRef.current;

    if (!sceneRenderer) return;

    sceneRenderer.setHigherPrimeColor(higherPrimeColor);
  }, [higherPrimeColor]);
}
