import { useEffect, useRef } from "react";
import { SceneManager } from "./three/SceneManager";
import { placeRatio } from "./placement";
import * as THREE from "three";

const LatticeCanvas = ({ ratios, mode, controls, removeRatio }) => {
  const containerRef = useRef(null);
  const managerRef = useRef(null);

  // initialize scene
  useEffect(() => {
    const container = containerRef.current;
    const manager = new SceneManager(container);
    manager.onRemove = id => removeRatio(id);

    managerRef.current = manager;

    const handleResize = () => manager.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(manager.renderer.domElement);
      managerRef.current = null;
    };
  }, [removeRatio]);

  useEffect(() => {
    if (!managerRef.current) return;

    const manager = managerRef.current;
    manager.clearPoints();

    ratios.forEach(r => {
      const coords = placeRatio(r, mode, controls);
      if (!coords) return;

      const { x, y, z } = coords;
      const label = `${r.octave.num}/${r.octave.den}`;
      const isHighPrime = coords.latticeType === 'prime';

      const data = {
        ...r,
        lattice: coords.lattice || [x, y, z],
        latticeType: coords.latticeType || 'global'
      };
      manager.addPoint(
        x,
        y,
        z,
        label,
        isHighPrime ? controls.primeColor : 0x3366ff,
        data
      );
    });
  }, [ratios, mode]);

  useEffect(() => {
    if (!managerRef.current) return;

    const manager = managerRef.current;
    const SPACING = 2;

    manager.points.forEach(point => {
      if (!point.userData || !point.userData.ratio) return;

      const r = point.userData.ratio;
      const coords = placeRatio(r, mode, controls);
      if (!coords) return;

      point.position.set(
        coords.x * SPACING,
        coords.y * SPACING,
        coords.z * SPACING
      );

      if (point.userData.labelSprite) {
        point.userData.labelSprite.position.set(
          coords.x * SPACING,
          coords.y * SPACING + 0.4,
          coords.z * SPACING
        );
      }
    });
  }, [
    controls.radiusScale,
    controls.rotation?.rotX,
    controls.rotation?.rotY,
    controls.rotation?.rotZ
  ]);

  useEffect(() => {
    if (!managerRef.current) return;

    const manager = managerRef.current;
    const color = new THREE.Color(controls.primeColor);

    manager.points.forEach(point => {
      if (!point.userData?.ratio) return;

      const isHighPrime = point.userData.latticeType === 'prime';
      if (isHighPrime && point.material?.color) {
        point.material.color.copy(color);
        point.material.needsUpdate = true;
      }
    });
  }, [controls.primeColor]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] bg-gray-100 rounded relative"
    />
  );
};

export default LatticeCanvas;
