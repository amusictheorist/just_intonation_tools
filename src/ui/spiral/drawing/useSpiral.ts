import { useEffect, useMemo, useRef } from "react";
import { DEFAULT_SPIRAL_RADIUS } from "../../../lib/spiral/math";
import { createSpiralDrawing } from "../drawing/createSpiralDrawing";
import { useSpiralState } from "../hooks/useSpiralState";
import { useSpiralController } from "./useSpiralController";

export const useSpiral = (radiusPerOctave = DEFAULT_SPIRAL_RADIUS) => {
  const svgGroupRef = useRef<SVGGElement>(null);

  const pathRef = useRef<SVGPathElement>(null);

  const state = useSpiralState();

  const drawing = useMemo(
    () => createSpiralDrawing(svgGroupRef, pathRef, radiusPerOctave),
    [radiusPerOctave],
  );

  const controller = useSpiralController(state, drawing);

  useEffect(() => {
    const groupElement = svgGroupRef.current;

    if (!groupElement) {
      return;
    }

    const centrePoint = groupElement.querySelector('[data-value="1"]');

    if (centrePoint) {
      return;
    }

    drawing.drawPoint(1, 0);
  }, [drawing]);

  return {
    ...state,
    ...controller,
    svgGroupRef,
    pathRef,
  };
};
