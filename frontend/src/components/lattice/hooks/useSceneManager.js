import { useEffect, useRef } from "react";
import { SceneManager } from "../threeScene/SceneManager";
import { addPoints } from "../threeScene/addPoints";
import { updatePoints } from "../threeScene/updatePoints";
import { updatePrimeColor } from "../threeScene/updatePrimeColor";

export const useSceneManager = (containerRef, { ratios, mode, controls, removeRatio }) => {
  const managerRef = useRef(null);

  // initialize scene manager
  useEffect(() => {
    const container = containerRef.current;
    const manager = new SceneManager(container);
    manager.onRemove = removeRatio;
    managerRef.current = manager;

    const handleResize = () => manager.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (manager.renderer?.domElement) {
        container.removeChild(manager.renderer.domElement);
      }

      managerRef.current = null;
    };
  }, []);

  // add points when ratios or mode changes
  useEffect(() => {
    if (!managerRef.current) return;
    addPoints(managerRef.current, ratios, mode, controls);
  }, [ratios, mode]);

  // update points for radius and rotation
  useEffect(() => {
    if (!managerRef.current) return;
    updatePoints(managerRef.current, ratios, mode, controls);
    managerRef.current.connections.update();
  }, [controls, ratios, mode]);

  // color update for high primes
  useEffect(() => {
    if (!managerRef.current) return;
    updatePrimeColor(managerRef.current, controls.primeColor);
  }, [controls.primeColor]);
};