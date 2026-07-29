import { useEffect, useRef, useState } from "react";
import { DEFAULT_SPIRAL_RADIUS } from "../../../lib/spiral/math";
import {
  createSpiralDrawing,
  type SpiralDrawing,
} from "../drawing/createSpiralDrawing";
import { useSpiralController } from "./useSpiralController";
import { useSpiralState } from "./useSpiralState";

export const useSpiral = (radiusPerOctave = DEFAULT_SPIRAL_RADIUS) => {
  const svgGroupRef = useRef<SVGGElement>(null);

  const pathRef = useRef<SVGPathElement>(null);

  const drawingRef = useRef<SpiralDrawing | null>(null);

  const [drawing, setDrawing] = useState<SpiralDrawing | null>(null);

  const state = useSpiralState();

  useEffect(() => {
    const nextDrawing = createSpiralDrawing(
      {
        getGroupElement: () => svgGroupRef.current,
        getPathElement: () => pathRef.current,
      },
      radiusPerOctave,
    );

    drawingRef.current = nextDrawing;
    setDrawing(nextDrawing);

    return () => {
      drawingRef.current = null;
    };
  }, [radiusPerOctave]);

  const controller = useSpiralController(state, drawing);

  useEffect(() => {
    const groupElement = svgGroupRef.current;

    if (!groupElement || !drawing) {
      return;
    }

    const centrePoint = groupElement.querySelector('[data-value="1"]');

    if (!centrePoint) {
      drawing.drawPoint(1, 0);
    }
  }, [drawing]);

  return {
    ...state,
    ...controller,
    svgGroupRef,
    pathRef,
  };
};
