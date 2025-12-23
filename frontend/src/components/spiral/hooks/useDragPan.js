import { useRef } from "react";

export const useDragPan = ({ extent, setPan }) => {
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  
  const onMouseDown = e => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = e => {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    const scale = (extent * 2) / e.currentTarget.clientWidth;

    setPan(p => ({
      x: p.x - dx * scale,
      y: p.y - dy * scale
    }));

    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp
  };
};