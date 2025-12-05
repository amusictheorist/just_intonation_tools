import { useEffect, useRef } from "react";
import { SceneManager } from "./three/SceneManager";

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
      const { canonical, octave } = r;

      let x, y, z;

      if (mode === 'canonical') {
        x = canonical.num;
        y = canonical.den;
        z = canonical.value;
      } else {
        x = octave.num;
        y = octave.den;
        z = octave.value;
      }

      manager.addPoint(x, y, z);
    }, [ratios, mode]);
  });

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] bg-gray-100 rounded relative"
    />
  );
};

export default LatticeCanvas;