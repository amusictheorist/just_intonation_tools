import { useEffect, useRef } from "react";
import { createSpiralDrawing } from "./useSpiralDrawing";
import { useSpiralState } from "./useSpiralState";
import { useSpiralController } from "./useSpiralController";

export const useSpiral = (r0 = 30) => {
  const svgGroupRef = useRef(null);
  const pathRef = useRef(null);
  const state = useSpiralState();
  const drawing = createSpiralDrawing(svgGroupRef, pathRef, r0);
  const controller = useSpiralController(state, drawing, r0);

  useEffect(() => {
    if (!svgGroupRef.current) return;

    const exists = svgGroupRef.current.querySelector('[data-value="1"]');
    if (exists) return;

    drawing.drawPoint(1, 0);
  }, [drawing]);

  return {
    ...state,
    ...controller,
    svgGroupRef,
    pathRef
  };
};