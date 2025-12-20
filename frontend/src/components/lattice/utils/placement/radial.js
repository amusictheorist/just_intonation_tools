import { BASE_RADIUS, Y_STEP } from "../math/constants";
import { factorRatio } from "../math/factors";
import { normalize, vec } from "../math/vectors";

const primeStepDirCache = new Map();

export const getPrimeStepDir = (p, sign) => {
  const key = `${p}_${sign}`;
  if (primeStepDirCache.has(key)) return primeStepDirCache.get(key);
  
  let num, den;

  if (sign > 0) {
    const m = Math.floor(Math.log2(p));
    num = p;
    den = 2 ** m;
  } else {
    const m = Math.ceil(Math.log2(p));
    num = 2 ** m;
    den = p;
  }

  const value = num / den;
  const angleDeg = (Math.log(value) / Math.log(2)) * 360;
  const angleRad = (angleDeg * Math.PI) / 180;

  const x = Math.sin(angleRad);
  const z = -Math.cos(angleRad);

  const dir = normalize(vec(x, 0, z));
  primeStepDirCache.set(key, dir);
  return dir;
};

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