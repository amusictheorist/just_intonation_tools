import { useEffect, useRef } from "react";
import { SceneManager } from "./three/SceneManager";
import { placeRatio } from "./placement";

const LatticeCanvas = ({ ratios, mode }) => {
  const containerRef = useRef(null);
  const managerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    managerRef.current = new SceneManager(container);

    const handleResize = () => managerRef.current.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(managerRef.current.renderer.domElement);
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!managerRef.current) return;

    const manager = managerRef.current;

    manager.clearPoints();

    ratios.forEach(r => {
      const coords = placeRatio(r, 'classic');
      if (!coords) {
        console.warn(`Ratio ${r.raw} above 7-limit, please choose a 7-limit ratio`);
        return;
      }
      const { x, y, z } = coords;
      const label = `${r.octave.num}/${r.octave.den}`;
      manager.addPoint(x, y, z, label, 0x3366ff, r);
    });
  }, [ratios, mode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] bg-gray-100 rounded relative"
    />
  );
};

export default LatticeCanvas;