import { drawOctaveLines, drawSpiral, polarToXY } from "../../../utils/spiralMath";

export const createSpiralDrawing = (svgGroupRef, pathRef, r0) => {
  if (!svgGroupRef || !pathRef) {
    throw new Error('createSpiralDrawing requires valid refs');
  }

  const drawPoint = (a, theta, onClick) => {
    const r = r0 * Math.log(a);
    const { x, y } = polarToXY(r, theta);

    const dot = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y);
    dot.setAttribute('r', 4);
    dot.setAttribute('fill', 'black');
    dot.setAttribute('data-value', a);
    dot.style.cursor = 'pointer';

    if (onClick) dot.addEventListener('click', onClick);

    svgGroupRef.current.appendChild(dot);

    const label = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    label.setAttribute('x', x + 6);
    label.setAttribute('y', y);
    label.setAttribute('font-size', 12);
    label.setAttribute('data-value', a);
    label.textContent = a;

    svgGroupRef.current.appendChild(label);
  };

  const extendSpiral = (oldTheta, newTheta) => {
    drawSpiral(pathRef.current, oldTheta, newTheta, true, r0);
    drawOctaveLines(svgGroupRef.current, newTheta, r0);
  };

  const shrinkSpiralTo = newTheta => {
    pathRef.current.setAttribute('d', '');
    svgGroupRef.current
      .querySelectorAll('.octave-line')
      .forEach(el => el.remove());
    
    if (newTheta > 0) {
      drawSpiral(pathRef.current, 0, newTheta, true, r0);
      drawOctaveLines(svgGroupRef.current, newTheta, r0);
    }
  };

  const removeValueVisual = n => {
    svgGroupRef.current
      .querySelectorAll(`[data-value="${n}"]`)
      .forEach(el => el.remove());
  };

  const clearExceptOne = () => {
    svgGroupRef.current
      .querySelectorAll(
        'circle[data-value]:not([data-value="1"]), text[data-value]:not([data-value="1"]), .octave-line'
      )
      .forEach(el => el.remove());
    
    pathRef.current.setAttribute('d', '');
  };

  return {
    drawPoint,
    extendSpiral,
    shrinkSpiralTo,
    removeValueVisual,
    clearExceptOne
  };
};