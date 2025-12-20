import { BASE_RADIUS, Y_STEP } from "../math/constants";
import { factorRatio } from "../math/factors";
import { getPrimeStepDir } from "../math/highPrimeGeometry";
import { vec } from "../math/vectors";

export const placeRadial = (ratio, controls = {}) => {
  const factors = factorRatio(ratio);

  if (factors.size === 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      lattice: [],
      latticeType: 'radial',
      primeAnchor: null
    };
  }

  let pos = vec(0, 0, 0);
  let totalSteps = 0;

  for (const [p, e] of factors.entries()) {
    if (e === 0) continue;

    const sign = e > 0 ? +1 : -1;
    const steps = Math.abs(e);
    totalSteps += steps;

    const dir = getPrimeStepDir(p, sign);
    pos.x += dir.x * BASE_RADIUS * steps;
    pos.z += dir.z * BASE_RADIUS * steps;
  }

  const y = totalSteps * Y_STEP;

  return {
    x: pos.x,
    y,
    z: pos.z,
    lattice: Array.from(factors.entries()),
    latticeType: 'radial',
    primeAnchor: null
  };
};