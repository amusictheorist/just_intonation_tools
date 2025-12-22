import { useCallback, useEffect, useRef, useState } from "react";
import { drawSpiral, drawOctaveLines, polarToXY } from '../utils/spiralMath';

export function useSpiral(r0 = 30) {
  const [values, setValues] = useState(new Set([1]));
  const [batches, setBatches] = useState([[1]]);
  const [selected, setSelected] = useState(new Set());
  const [maxTheta, setMaxTheta] = useState(360 * Math.log2(1));

  const svgGroupRef = useRef(null);
  const pathRef = useRef(null);

  const addPointBatch = useCallback((arr) => {
    const unique = [...new Set(arr)].filter((n) => n > 0);

    const newVals = unique.filter((n) => !values.has(n));

    if (newVals.length === 0) return;

    newVals.forEach((a) => {

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
      dot.setAttribute("data-value", a);
      dot.style.cursor = "pointer";

      dot.addEventListener("click", () => {
        setSelected((prev) => {
          const s = new Set(prev);
          s.has(a) ? s.delete(a) : s.add(a);
          return s;
        });
      });

      svgGroupRef.current.appendChild(dot);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x + 6);
      label.setAttribute("y", y);
      label.setAttribute("font-size", "12");
      label.setAttribute('data-value', a)
      label.textContent = a;
      svgGroupRef.current.appendChild(label);
    });

    setValues((prev) => {
      const next = new Set(prev);
      newVals.forEach((n) => next.add(n));
      return next;
    });

    setBatches((prev) => [...prev, newVals]);

  }, [values, maxTheta, r0]);

  useEffect(() => {
    if (!svgGroupRef.current || !pathRef.current) return;
    if (!values.has(1)) return;

    const a = 1;
    const theta = 0;
    const r = 0;
    const { x, y } = polarToXY(r, theta);

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y);
    dot.setAttribute('r', 4);
    dot.setAttribute('fill', 'black');
    dot.setAttribute('data-value', a);
    dot.style.cursor = 'pointer';

    dot.addEventListener('click', () => {
      setSelected(prev => {
        const s = new Set(prev);
        s.has(a) ? s.delete(a) : s.add(a);
        return s;
      });
    });

    svgGroupRef.current.appendChild(dot);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + 6);
    label.setAttribute('y', y);
    label.setAttribute('font-size', '12');
    label.setAttribute('data-value', a)
    label.textContent = a;
    svgGroupRef.current.appendChild(label);
  }, [svgGroupRef, pathRef]);

  const removeValue = useCallback(n => {
    if (n === 1) return;

    setValues(prev => {
      const next = new Set(prev);
      next.delete(n);
      return next;
    });

    setSelected(prev => {
      const next = new Set(prev);
      next.delete(n);
      return next;
    });

    if (svgGroupRef.current) {
      svgGroupRef.current
        .querySelectorAll(`[data-value="${n}"]`)
        .forEach(el => el.remove());
    }

    setBatches(prev =>
      prev.map(batch => batch.filter(x => x !== n)).filter(b => b.length > 0)
    );
  }, []);

  const undoLastBatch = useCallback(() => {
    setBatches(prev => {
      if (prev.length <= 1) return prev;

      const last = prev[prev.length - 1];

      if (svgGroupRef.current) {
        last.forEach(n => {
          svgGroupRef.current
            .querySelectorAll(`[data-value="${n}"]`)
            .forEach(el => el.remove());
        });
      }

      setValues(prevVals => {
        const next = new Set(prevVals);
        last.forEach(n => next.delete(n));
        return next;
      });

      setSelected(prevSel => {
        const next = new Set(prevSel);
        last.forEach(n => next.delete(n));
        return next;
      });

      return prev.slice(0, -1);
    });
  }, []);

  const resetToOne = useCallback(() => {
    if (svgGroupRef.current) {
      while (svgGroupRef.current.firstChild) {
        svgGroupRef.current.removeChild(svgGroupRef.current.firstChild);
      }
    }
    if (pathRef.current) {
      pathRef.current.setAttribute('d', '');
    }

    setValues(new Set([1]));
    setBatches([[1]]);
    setSelected(new Set());
    setMaxTheta(0);

    const a = 1;
    const theta = 0;
    const r = 0;
    const { x, y } = polarToXY(r, theta);

    if (svgGroupRef.current) {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', 4);
      dot.setAttribute('fill', 'black');
      dot.setAttribute('data-value', a);
      svgGroupRef.current.appendChild(dot);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x + 6);
      label.setAttribute('y', y);
      label.setAttribute('font-size', '12');
      label.setAttribute('data-value', a);
      label.textContent = '1';
      svgGroupRef.current.appendChild(label)
    }
  }, []);
  
  return {
    values,
    batches,
    selected,
    setSelected,
    addPointBatch,
    removeValue,
    undoLastBatch,
    resetToOne,
    svgGroupRef,
    pathRef
  };
}
