import { BASE_RADIUS, Y_STEP } from "../math/constants";
import { factorRatio } from "../math/factors";
import { vec } from "../math/vectors";
import { getPrimeStepDir } from "../math/highPrimeGeometry";

export const placeExpandedRadial = (ratio, controls = {}) => {
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

  const baseValue = ratio.canonical?.value ?? (ratio.canonical.num / ratio.canonical.den);
  const isBelow = baseValue < 1;

  let pos = vec(0, 0, 0);
  let totalSteps = 0;

  for (const [p, e] of factors.entries()) {
    if (e === 0) continue;

    const orientedExp = isBelow ? -e : e;
    if (orientedExp === 0) continue;

    const sign = orientedExp > 0 ? +1 : -1;
    const steps = Math.abs(orientedExp);

    const dir = getPrimeStepDir(p, sign);

    pos.x += dir.x * BASE_RADIUS * steps;
    pos.z += dir.z * BASE_RADIUS * steps;

    totalSteps += steps;
  }

  const y = (isBelow ? -1 : +1) * totalSteps * Y_STEP;

  return {
    x: pos.x,
    y,
    z: pos.z,
    lattice: Array.from(factors.entries()),
    latticeType: 'radial',
    primeAnchor: null
  };
};