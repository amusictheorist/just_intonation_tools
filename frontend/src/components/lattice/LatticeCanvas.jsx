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
      const { x, y, z } = placeRatio(r, 'classic');
      const label = `${r.octave.num}/${r.octave.den}`;
      manager.addPoint(x, y, z, label);
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