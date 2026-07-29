import type { Dispatch, RefObject, SetStateAction } from "react";
import { DEFAULT_SPIRAL_RADIUS } from "../../../lib/spiral/math";
import type { SpiralPan } from "../../../lib/spiral/types";
import { useSpiralViewBox } from "../hooks/useSpiralViewBox";
import { useSpiralSelectionStyling } from "../drawing/useSpiralSelectionStyling";
import { useDragPan } from "../hooks/useDragPan";

type SpiralCanvasProps = {
  svgGroupRef: RefObject<SVGGElement | null>;
  pathRef: RefObject<SVGPathElement | null>;
  selected: Set<number>;
  maxTheta: number;
  radiusPerOctave?: number;
  zoom: number;
  pan: SpiralPan;
  setPan: Dispatch<SetStateAction<SpiralPan>>;
};

function SpiralCanvas({
  svgGroupRef,
  pathRef,
  selected,
  maxTheta,
  radiusPerOctave = DEFAULT_SPIRAL_RADIUS,
  zoom,
  pan,
  setPan,
}: SpiralCanvasProps) {
  useSpiralSelectionStyling(svgGroupRef, selected);

  const { viewBox, extent, baseExtent } = useSpiralViewBox({
    maxTheta,
    zoom,
    pan,
    radiusPerOctave,
  });

  const { onMouseDown, onMouseMove, onMouseUp } = useDragPan({
    extent,
    baseExtent,
    setPan,
  });

  return (
    <svg
      viewBox={viewBox}
      aria-label="Interactive harmonic spiral"
      className="h-full w-full cursor-grab rounded-lg border border-gray-300 bg-white shadow-sm active:cursor-grabbing"
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
          strokeWidth={1}
          pointerEvents="none"
        />
      </g>
    </svg>
  );
}

export default SpiralCanvas;
