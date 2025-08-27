const SpiralCanvas = ({ svgGroupRef, pathRef }) => (
  <svg viewBox="-200 -200 400 400" width='850' height='850' className="border">
    <g ref={svgGroupRef}>
      <path ref={pathRef} stroke="grey" fill="none" strokeWidth='1' />
    </g>
  </svg>
);

export default SpiralCanvas;