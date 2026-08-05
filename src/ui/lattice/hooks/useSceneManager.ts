import { useEffect, useRef, type RefObject } from "react";
import type {
  LatticeControls,
  PlacementMode,
  Ratio,
} from "../../../lib/lattice/types";
import { SceneManager } from "../scene/SceneManager";
import { addPoints } from "../scene/addPoints";
import { updatePoints } from "../scene/updatePoints";
import { updatePrimeColor } from "../scene/updatePrimeColor";

type UseSceneManagerOptions = {
  ratios: Ratio[];
  mode: PlacementMode;
  controls: LatticeControls;
  removeRatio: (id: string) => void;
};

export const useSceneManager = (
  containerRef: RefObject<HTMLDivElement | null>,
  { ratios, mode, controls, removeRatio }: UseSceneManagerOptions,
): void => {
  const managerRef = useRef<SceneManager | null>(null);

  // keep the latest remove callback available without rebuilding the Three.js scene whenever its identity changes.

  const removeRatioRef = useRef(removeRatio);
  const controlsRef = useRef(controls);

  useEffect(() => {
    removeRatioRef.current = removeRatio;
  }, [removeRatio]);

  // initialize and dispose of the scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const manager = new SceneManager(container);

    manager.onRemove = (id) => {
      removeRatioRef.current(id);
    };

    managerRef.current = manager;

    const handleResize = () => {
      manager.resize();
    };

    window.addEventListener("resize", handleResize);
    manager.resize();

    return () => {
      window.removeEventListener("resize", handleResize);

      manager.dispose();
      managerRef.current = null;
    };
  }, [containerRef]);

  // rebuild points when the ratio collection or placement mode changes.
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    addPoints(manager, ratios, mode, controlsRef.current);
  }, [ratios, mode]);

  // reposition existing points when the placement controls change
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    updatePoints(manager, mode, controls);
  }, [mode, controls]);

  // update high-prime colours without rebuilding the complete scene.
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    updatePrimeColor(manager, controls.primeColor);
  }, [controls.primeColor]);
};
