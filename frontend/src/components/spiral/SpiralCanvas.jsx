import { useEffect, useRef } from "react"

const SpiralCanvas = ({
  svgGroupRef,
  pathRef,
  selected,
  maxTheta,
  r0 = 30,
  zoom = 1,
  pan,
  setPan
}) => {
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgGroupRef.current) return;

    svgGroupRef.current.querySelectorAll('circle').forEach((dot) => {
      const val = Number(dot.getAttribute('data-value'));
      if (!isNaN(val)) {
        dot.setAttribute('fill', selected.has(val) ? 'red' : 'black');
      }
    });
  }, [selected, svgGroupRef]);

  const rMax = r0 * (maxTheta / 360);
  const padding = 60;
  const baseExtent = Math.max(rMax + padding, 120);
  const extent = baseExtent / zoom;

  const viewBox = [
    -extent + pan.x,
    -extent + pan.y,
    extent * 2,
    extent * 2
  ].join(' ');

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

  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full border border-gray-400 bg-white rounded-lg shadow"
      preserveAspectRatio="xMidYMid meet"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <g ref={svgGroupRef}>
        <path
          ref={pathRef}
          stroke="gray"
          fill="none"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

export default SpiralCanvas;
