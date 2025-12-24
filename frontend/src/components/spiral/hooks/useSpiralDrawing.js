import { drawOctaveLines, drawSpiral, polarToXY } from "../../../utils/spiralMath";

export const createSpiralDrawing = (svgGroupRef, pathRef, r0) => {
  if (!svgGroupRef || !pathRef) {
    throw new Error('createSpiralDrawing requires valid refs');
  }

  const drawPoint = (a, theta, onClick) => {
    const r = r0 * Math.log2(a);
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
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Partial ${a}`);
    dot.style.cursor = 'pointer';

    if (onClick) dot.addEventListener('click', onClick);
    
    dot.addEventListener('focus', () => {
      dot.setAttribute('stroke', '#2563eb');
      dot.setAttribute('strike-width', '2');
    });

    dot.addEventListener('blur', () => {
      dot.removeAttribute('stroke');
      dot.removeAttribute('stroke-width');
    });

    svgGroupRef.current.appendChild(dot);

    const label = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );

    let lx = x;
    let ly = y;

    if (a === 1) {
      lx = x + 4;
      ly = y - 4;
    } else {
      
      const mag = Math.sqrt(x * x + y * y) || 1;
      const ux = x / mag;
      const uy = y / mag;
      const offset = 16;

      lx = x + ux * offset;
      ly = y + uy * offset
    }

    label.setAttribute('x', lx);
    label.setAttribute('y', ly);
    label.setAttribute('font-size', 10);
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