import { useEffect, useRef, useState } from "react";
import { SceneManager } from "./three/SceneManager";
import { placeRatio } from "./placement";

const LatticeCanvas = ({ ratios, mode, controls, controlsReady, removeRatio }) => {
  const containerRef = useRef(null);
  const managerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const last = useRef({ x: 0, y: 0 });

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
    if (!controlsReady) return;

    const manager = managerRef.current;
    manager.clearPoints();

    ratios.forEach(r => {
      const coords = placeRatio(r, mode, controls);
      if (!coords) {
        console.warn(`Could not place ratio ${r.raw}`);
        return;
      }

      const { x, y, z } = coords;
      const label = `${r.octave.num}/${r.octave.den}`;
      manager.addPoint(x, y, z, label, 0x3366ff, r);
    });
  }, [ratios, mode, controlsReady]);

  useEffect(() => {
    if (!managerRef.current) return;
    if (!controlsReady) return;

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

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] bg-gray-100 rounded relative"
    />
  );
};

export default LatticeCanvas;
