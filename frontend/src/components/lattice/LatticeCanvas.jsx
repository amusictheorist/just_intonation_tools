import { useEffect, useRef } from "react";
import { SceneManager } from "./three/SceneManager";
import { placeRatio } from "./placement";

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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(manager.renderer.domElement);
      managerRef.current = null;
    };
  }, [removeRatio]);

  // update points whenever ratios or controls change
  useEffect(() => {
    if (!managerRef.current) return;

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
  }, [ratios, mode]);

  useEffect(() => {
    if (!managerRef.current) return;

    const manager = managerRef.current;

    manager.points.forEach(point => {
      if (!point.userData || !point.userData.ratio) return;

      const r = point.userData.ratio;
      const coords = placeRatio(r, mode, controls);
      if (!coords) return;

      point.position.set(coords.x, coords.y, coords.z);

      if (point.userData.labelSprite) {
        point.userData.labelSprite.position.set(coords.x, coords.y + 0.4, coords.z);
      }
    });
  }, [controls.radiusScale, controls.rotationAngle]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] bg-gray-100 rounded relative"
    />
  );
};

export default LatticeCanvas;