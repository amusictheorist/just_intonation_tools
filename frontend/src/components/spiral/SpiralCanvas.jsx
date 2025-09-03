import { useEffect } from "react"

const SpiralCanvas = ({ svgGroupRef, pathRef, selected }) => {
  useEffect(() => {
    if (!svgGroupRef.current) return;

    svgGroupRef.current.querySelectorAll('circle').forEach((dot) => {
      const val = Number(dot.getAttribute('data-value'));
      if (!isNaN(val)) {
        dot.setAttribute('fill', selected.has(val) ? 'red' : 'black');
      }
    });
  }, [selected, svgGroupRef]);

  return (
    <svg
      viewBox="-200 -200 400 400"
      className="w-[600px] h-[600px] border border-gray-400 bg-white rounded-lg shadow"
    >
      <g ref={svgGroupRef}>
        <path ref={pathRef} stroke="gray" fill="none" strokeWidth="1" />
      </g>
    </svg>
  );
};

export default SpiralCanvas;
