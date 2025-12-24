import { useEffect } from "react";
import { useDragPan } from "./hooks/useDragPan";
import { useSpiralSelectionStyling } from "./hooks/useSpiralSelectionStyling";
import { useSpiralViewBox } from "./hooks/useSpiralViewBox";

const SpiralCanvas = ({
  svgGroupRef,
  pathRef,
  selected,
  maxTheta,
  r0 = 30,
  zoom,
  pan,
  setPan
}) => {
  useSpiralSelectionStyling(svgGroupRef, selected);

  const { viewBox, extent, baseExtent } = useSpiralViewBox({
    maxTheta,
    zoom,
    pan,
    r0
  });

  const {
    onMouseDown,
    onMouseMove,
    onMouseUp
  } = useDragPan({
    extent,
    setPan,
    baseExtent
  });

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
          pointerEvents='none'
        />
      </g>
    </svg>
  );
};

export default SpiralCanvas;
