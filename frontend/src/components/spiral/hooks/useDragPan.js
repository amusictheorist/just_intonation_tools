import { useRef } from "react";

export function useDragPan({
  extent,
  baseExtent,
  setPan,
  margin = 40
}) {
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  const maxPan = Math.max(0, baseExtent - extent + margin);

  const onMouseDown = (e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    const scale = (extent * 2) / e.currentTarget.clientWidth;

    setPan((p) => ({
      x: clamp(p.x - dx * scale, -maxPan, maxPan),
      y: clamp(p.y - dy * scale, -maxPan, maxPan)
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
}
