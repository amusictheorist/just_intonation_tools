import { useEffect } from "react";
import { useDragPan } from "./hooks/useDragPan";
import { useSpiralSelectionStyling } from "./hooks/useSpiralSelectionStyling";
import { useSpiralViewBox } from "./hooks/useSpiralViewBox";
import { useSpiralVisibility } from "./hooks/useSpiralVisibility";

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

  useSpiralVisibility(svgGroupRef);

  useEffect(() => {
    if (!svgGroupRef.current) return;

    const SHOW_ALL_ZOOM = 1.75;

    svgGroupRef.current.querySelectorAll('text[data-value]').forEach(label => {
      const val = Number(label.getAttribute('data-value'));
      if (Number.isNaN(val)) return;

      if (val < 120) {
        label.style.display = '';
        return;
      }

      const shouldHide = zoom < SHOW_ALL_ZOOM && (val % 2 === 1);
      label.style.display = shouldHide ? 'none' : '';
    });
  }, [zoom, svgGroupRef]);
  
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
