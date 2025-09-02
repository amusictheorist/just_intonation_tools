const SpiralCanvas = ({ svgGroupRef, pathRef }) => (
  <svg
    viewBox="-200 -200 400 400"
    className="w-[600px] h-[600px] border border-gray-400 bg-white rounded-lg shadow"
  >
    <g ref={svgGroupRef}>
      <path ref={pathRef} stroke="gray" fill="none" strokeWidth="1" />
    </g>
  </svg>
);

export default SpiralCanvas;
