import { useEffect } from "react"

const SpiralCanvas = ({
  svgGroupRef,
  pathRef,
  selected,
  maxTheta,
  r0 = 30,
  zoom = 1
}) => {
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
    -extent,
    -extent,
    extent * 2,
    extent * 2
  ].join(' ');

  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full border border-gray-400 bg-white rounded-lg shadow"
      preserveAspectRatio="xMidYMid meet"
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
