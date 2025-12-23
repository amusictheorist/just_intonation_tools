import { useEffect, useState } from "react";

export const useSpiralCamera = () => {
  const [targetZoom, setTargetZoom] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf;
    const duration = 180;
    const start = performance.now();
    const startZoom = zoom;
    const delta = targetZoom - startZoom;

    if (Math.abs(delta) < 0.001) return;

    const animate = t => {
      const elapsed = t - start;
      const lin = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - lin, 3);

      setZoom(startZoom + delta * eased);

      if (lin < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [targetZoom]);

  useEffect(() => {
    const step = 30;

    const onKeyDown = e => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      setPan(p => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            return { ...p, y: p.y - step };
          case 'ArrowDown':
          case 's':
          case 'S':
            return { ...p, y: p.y + step };
          case 'ArrowLeft':
          case 'a':
          case 'A':
            return { ...p, x: p.x - step };
          case 'ArrowRight':
          case 'd':
          case 'D':
            return { ...p, x: p.x + step };
          default:
            return p;
        }
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const resetView = () => {
    setTargetZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return {
    zoom,
    targetZoom,
    setTargetZoom,
    pan,
    setPan,
    resetView
  };
};