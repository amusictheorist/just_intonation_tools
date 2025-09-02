import { useCallback, useEffect, useRef, useState } from "react";
import { drawOctaveLines, drawSpiral, polarToXY } from "../utils/spiralMath";

export function useSpiral(r0 = 30) {
  const [values, setValues] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [maxTheta, setMaxTheta] = useState(0);

  const svgGroupRef = useRef(null);
  const pathRef = useRef(null);

  const addPoint = useCallback((a) => {
    if (a <= 0) return;

    const theta = 360 * Math.log2(a);

    if (theta > maxTheta) {
      drawSpiral(pathRef.current, maxTheta, theta, true, r0);
      setMaxTheta(theta);
      drawOctaveLines(svgGroupRef.current, theta, r0);
    }

    const r = r0 * Math.log(a);
    const { x, y } = polarToXY(r, theta);

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", 4);
    dot.setAttribute("fill", "black");
    dot.style.cursor = "pointer";

    dot.addEventListener("click", () => {
      setSelected((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(a)) {
          newSet.delete(a);
          dot.setAttribute("fill", "black");
        } else {
          newSet.add(a);
          dot.setAttribute("fill", "red");
        }
        return newSet;
      });
    });

    svgGroupRef.current.appendChild(dot);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + 6);
    label.setAttribute("y", y);
    label.setAttribute("font-size", "12");
    label.textContent = a;
    svgGroupRef.current.appendChild(label);

    setValues((prev) => (prev.includes(a) ? prev : [...prev, a]));
    }, [maxTheta, r0]);

  useEffect(() => {
    if (svgGroupRef.current && pathRef.current) {
      addPoint(1);
    }
  }, [addPoint]);

  return { values, selected, addPoint, svgGroupRef, pathRef };
}
