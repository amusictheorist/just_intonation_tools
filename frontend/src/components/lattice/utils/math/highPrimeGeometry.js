import { PRIME_INDEX, N } from './primes';
import { GOLDEN_ANGLE, BASE_RADIUS } from './constants';
import { vec, scale, normalize, dot, cross } from './vectors';

export const computePrimePosition = (p, radiusScale) => {
  if (radiusScale == null) radiusScale = 1;
  const idx = PRIME_INDEX[p];
  if (idx === undefined) throw new Error(`Prime ${p} not in PRIME_INDEX`);

  const t = (idx + 0.5) / N;
  const z = 1 - 2 * t;
  const r = Math.sqrt(1 - z * z);
  const theta = idx * GOLDEN_ANGLE;

  const base = vec(r * Math.cos(theta), r * Math.sin(theta), z);
  return scale(normalize(base), BASE_RADIUS * radiusScale);
};

const primeFrames = new Map();

export const getPrimeFrame = (p, radiusScale, rotationAngle = 0, sign = +1) => {
  const key = `${p}_${radiusScale}+${rotationAngle}_${sign}`;
  if (primeFrames.has(key)) return primeFrames.get(key);

  let origin = computePrimePosition(p, radiusScale);

  if (sign < 0) origin = scale(origin, -1);

  const radial = normalize(origin);

  let up = vec(0, 1, 0);
  if (Math.abs(dot(radial, up)) > 0.9) up = vec(1, 0, 0);

  let Xp = normalize(cross(up, radial));
  let Yp = normalize(cross(radial, Xp));
  const Zp = radial;

  const frame = { origin, Xp, Yp, Zp };
  primeFrames.set(key, frame);
  return frame;
};

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