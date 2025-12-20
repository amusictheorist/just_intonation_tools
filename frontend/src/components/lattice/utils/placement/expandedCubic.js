import { BASE_RADIUS, GOLDEN_ANGLE, MAX_PRIME, SPACING, SUB_PRIME_STEP } from "../../utils/math/constants";
import { factorRatio } from "../math/factors";
import { sieve } from "../math/primes";
import { vec, scale, normalize, dot, cross, addScaled, sub, applyRotation } from "../math/vectors";
import { place as placeCubic } from "./cubic";

const ALL_PRIMES = sieve(MAX_PRIME);
const PRIME_INDEX = {};
ALL_PRIMES.forEach((p, i) => PRIME_INDEX[p] = i);
const N = ALL_PRIMES.length;

// computing spherical prime positioning
const computePrimePosition = (p, radiusScale) => {
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

const getPrimeFrame = (p, radiusScale, rotationAngle = 0, sign = +1) => {
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

// main sphere placement
export const placeExpanded = (ratio, controls = {}) => {
  const { radiusScale = 1, rotation = {} } = controls;
  const factors = factorRatio(ratio);

  const a = factors.get(3) || 0;
  const b = factors.get(5) || 0;
  const c = factors.get(7) || 0;

  const highPrimes = [...factors.entries()].filter(([p, e]) => p > 7 && e !== 0);

  if (highPrimes.length === 0) {
    const base = placeCubic(ratio);
    if (!base) return null;

    return {
      x: base.x,
      y: base.y,
      z: base.z,
      lattice: base.lattice || [base.x, base.y, base.z],
      latticeType: 'global',
      primeAnchor: null
    };
  }

  const anchor = highPrimes.reduce((m, c) => (c[0] > m[0] ? c : m));
  const [anchorPrime, anchorExp] = anchor;
  const sign = anchorExp > 0 ? +1 : -1;

  const frame = getPrimeFrame(anchorPrime, radiusScale, 0, sign);

  let pos = { ...frame.origin };

  if (a !== 0) pos = addScaled(pos, frame.Xp, a * SPACING);
  if (b !== 0) pos = addScaled(pos, frame.Yp, b * SPACING);
  if (c !== 0) pos = addScaled(pos, frame.Zp, c * SPACING);

  for (const [p, e] of highPrimes) {
    if (p === anchorPrime) continue;

    const otherOrigin = scale(computePrimePosition(p, radiusScale), e > 0 ? +1 : -1);
    const dir = normalize(sub(otherOrigin, frame.origin));
    pos = addScaled(pos, dir, Math.abs(e) * SUB_PRIME_STEP);
  }

  let finalPos = pos;
  if (highPrimes.length > 0) {
    finalPos = applyRotation(pos, rotation);
  }

  return {
    x: finalPos.x,
    y: finalPos.y,
    z: finalPos.z,
    lattice: [a, b, c],
    latticeType: 'prime',
    primeAnchor: anchorPrime
  }
};