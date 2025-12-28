export function polarToXY(r, thetaDeg) {
  const t = (-(thetaDeg) + 90) * Math.PI / 180;
  return {
    x: r * Math.cos(t),
    y: -r * Math.sin(t)
  };
}

export function rOfTheta(thetaDeg, r0 = 30) {
  return r0 * (thetaDeg / 360);
}

export function drawSpiral(pathEl, thetaStart, thetaEnd, animate = false, r0 = 30) {
  const step = 1;

  if (!animate) {
    let d = pathEl.getAttribute('d') || '';
    for (let th = thetaStart; th <= thetaEnd; th += step) {
      const r = rOfTheta(th, r0);
      const { x, y } = polarToXY(r, th);
      d += (d === '' ? `M${x},${y}` : `L${x},${y}`);
    }
    pathEl.setAttribute('d', d);
    return;
  }

  const duration = 2000;
  const totalAngle = thetaEnd - thetaStart;
  const prefixD = pathEl.getAttribute('d') || '';
  let startTime = null;
  const startWithMove = (prefixD === '');

  function extend(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const lin = Math.min(elapsed / duration, 1);
    const t = 1 - Math.pow(1 - lin, 3);
    const currentTheta = thetaStart + totalAngle * t;

    let dNow = prefixD;
    let th = thetaStart;

    if (startWithMove) {
      const r0Now = rOfTheta(th, r0);
      const p0 = polarToXY(r0Now, th);
      dNow += `M${p0.x},${p0.y}`;
    } else {
      th += step;
    }

    for (; th <= currentTheta; th += step) {
      const r = rOfTheta(th, r0);
      const { x, y } = polarToXY(r, th);
      dNow += `L${x},${y}`;
    }

    if ((currentTheta - (Math.floor((currentTheta - thetaStart) / step) * step + thetaStart)) > 1e-6) {
      const r = rOfTheta(currentTheta, r0);
      const { x, y } = polarToXY(r, currentTheta);
      dNow += `L${x},${y}`;
    }

    pathEl.setAttribute('d', dNow);

    if (t < 1) requestAnimationFrame(extend);
  }
  requestAnimationFrame(extend);
}

export function drawOctaveLines(gEl, maxTheta, r0 = 30) {
  gEl.querySelectorAll('.octave-line').forEach(el => el.remove());

  const numOctaves = Math.floor(maxTheta / 360);

  for (let k = 1; k <= numOctaves; k++) {
    const theta = 360 * k;
    const r = rOfTheta(theta, r0);
    const { x, y } = polarToXY(r, theta);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'blue');
    line.setAttribute('stroke-dasharray', '4,4');
    line.setAttribute('class', 'octave-line');

    gEl.appendChild(line);
  }
}