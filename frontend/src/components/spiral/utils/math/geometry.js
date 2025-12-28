export const polarToXY = (r, thetaDeg) => {
  const t = (-(thetaDeg) + 90) * Math.PI / 180;
  return {
    x: r * Math.cos(t),
    y: -r * Math.sin(t)
  };
};

export const rOfTheta = (thetaDeg, r0 = 30) => {
  return r0 * (thetaDeg / 360);
};

export const thetaOfR = (r, r0 = 30) => {
  return 360 * (r / r0);
};